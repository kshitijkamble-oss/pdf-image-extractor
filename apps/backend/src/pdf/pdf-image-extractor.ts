import { Logger } from '@nestjs/common';
import { mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import type { Sharp } from 'sharp';
import type { PDFPageProxy } from 'pdfjs-dist';
import { loadPdfjs } from './pdfjs-loader.js';
import { findCaption } from './caption.util.js';
import type { CaptionTextLine } from './caption.util.js';

const require = createRequire(import.meta.url);

// Silences a pdfjs warning: without this it can't find metrics for
// non-embedded standard fonts while building the operator list.
const STANDARD_FONT_DATA_URL = `${join(
  dirname(require.resolve('pdfjs-dist/package.json')),
  'standard_fonts',
)}/`;

const MIN_IMAGE_DIMENSION_PX = 50;
const GRAYSCALE_1BPP = 1;
const RGB_24BPP = 2;
const RGBA_32BPP = 3;
const LINE_Y_TOLERANCE_PT = 2;

const logger = new Logger('PdfImageExtractor');

export interface ImageBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedImage {
  pageNumber: number;
  imageUrl: string;
  boundingBox: ImageBoundingBox;
  caption: string;
}

interface PdfImageData {
  width: number;
  height: number;
  kind: number;
  data?: Uint8Array | Uint8ClampedArray;
}

type Matrix = [number, number, number, number, number, number];

const IDENTITY_MATRIX: Matrix = [1, 0, 0, 1, 0, 0];

function combineMatrices(current: Matrix, next: Matrix): Matrix {
  return [
    current[0] * next[0] + current[2] * next[1],
    current[1] * next[0] + current[3] * next[1],
    current[0] * next[2] + current[2] * next[3],
    current[1] * next[2] + current[3] * next[3],
    current[0] * next[4] + current[2] * next[5] + current[4],
    current[1] * next[4] + current[3] * next[5] + current[5],
  ];
}

function boundingBoxFromMatrix(matrix: Matrix): ImageBoundingBox {
  const [a, b, c, d, e, f] = matrix;
  const corners: Array<[number, number]> = [
    [e, f],
    [a + e, b + f],
    [c + e, d + f],
    [a + c + e, b + d + f],
  ];
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
  };
}

function resolvePdfObject<T>(page: PDFPageProxy, objId: string): Promise<T> {
  const store = page.commonObjs.has(objId) ? page.commonObjs : page.objs;
  return new Promise<T>((resolve) => {
    store.get(objId, (data: T) => resolve(data));
  });
}

function unpackGrayscale1Bpp(
  data: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
): Buffer {
  const rowBytes = Math.ceil(width / 8);
  const out = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * rowBytes;
    for (let x = 0; x < width; x++) {
      const byte = data[rowStart + (x >> 3)] ?? 0;
      const bit = (byte >> (7 - (x & 7))) & 1;
      out[y * width + x] = bit ? 255 : 0;
    }
  }
  return out;
}

async function saveImage(
  imageData: PdfImageData,
  filePath: string,
): Promise<boolean> {
  const { width, height, kind, data } = imageData;

  if (!data) {
    logger.warn(`Skipping bitmap-only image with no pixel data: ${filePath}`);
    return false;
  }
  if (width < MIN_IMAGE_DIMENSION_PX || height < MIN_IMAGE_DIMENSION_PX) {
    return false;
  }

  let pipeline: Sharp;
  if (kind === RGBA_32BPP) {
    pipeline = sharp(Buffer.from(data), {
      raw: { width, height, channels: 4 },
    });
  } else if (kind === RGB_24BPP) {
    pipeline = sharp(Buffer.from(data), {
      raw: { width, height, channels: 3 },
    });
  } else if (kind === GRAYSCALE_1BPP) {
    pipeline = sharp(unpackGrayscale1Bpp(data, width, height), {
      raw: { width, height, channels: 1 },
    });
  } else {
    logger.warn(`Skipping image with unsupported kind ${kind}: ${filePath}`);
    return false;
  }

  await pipeline.png().toFile(filePath);
  return true;
}

interface RawTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

async function extractTextLines(page: PDFPageProxy): Promise<CaptionTextLine[]> {
  const textContent = await page.getTextContent();
  const items: RawTextItem[] = [];

  for (const item of textContent.items) {
    if (!('str' in item) || item.str.trim() === '') {
      continue;
    }
    const transform = item.transform as unknown as number[];
    items.push({
      text: item.str,
      x: transform[4],
      y: transform[5],
      width: item.width,
      height: item.height,
    });
  }

  const sortedTopToBottom = [...items].sort((a, b) => b.y - a.y);
  const groups: RawTextItem[][] = [];

  for (const item of sortedTopToBottom) {
    const currentGroup = groups[groups.length - 1];
    if (
      currentGroup &&
      Math.abs(currentGroup[0].y - item.y) <= LINE_Y_TOLERANCE_PT
    ) {
      currentGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  return groups.map((group) => {
    const byX = [...group].sort((a, b) => a.x - b.x);
    const text = byX
      .map((entry) => entry.text)
      .join(' ')
      .trim();
    const minX = Math.min(...group.map((entry) => entry.x));
    const maxRight = Math.max(...group.map((entry) => entry.x + entry.width));
    const minY = Math.min(...group.map((entry) => entry.y));
    const maxTop = Math.max(...group.map((entry) => entry.y + entry.height));
    return {
      text,
      boundingBox: {
        x: minX,
        y: minY,
        width: maxRight - minX,
        height: maxTop - minY,
      },
    };
  });
}

export async function extractImages(
  buffer: Buffer,
  uploadId: string,
  uploadsRoot: string,
): Promise<ExtractedImage[]> {
  const pdfjs = await loadPdfjs();
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    isOffscreenCanvasSupported: false,
    useWorkerFetch: false,
    useSystemFonts: false,
    disableFontFace: true,
    standardFontDataUrl: STANDARD_FONT_DATA_URL,
  });

  const uploadDir = join(uploadsRoot, uploadId);
  await mkdir(uploadDir, { recursive: true });

  const images: ExtractedImage[] = [];

  try {
    const document = await loadingTask.promise;

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const operatorList = await page.getOperatorList();
      const textLines = await extractTextLines(page);

      let ctm: Matrix = IDENTITY_MATRIX;
      const matrixStack: Matrix[] = [];
      let imageCount = 0;

      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const fn = operatorList.fnArray[i];
        const args: unknown = operatorList.argsArray[i];

        if (fn === pdfjs.OPS.save) {
          matrixStack.push(ctm);
        } else if (fn === pdfjs.OPS.restore) {
          ctm = matrixStack.pop() ?? IDENTITY_MATRIX;
        } else if (fn === pdfjs.OPS.transform) {
          ctm = combineMatrices(ctm, args as Matrix);
        } else if (fn === pdfjs.OPS.paintImageXObject) {
          const [objId] = args as [string, number, number];
          const imageData = await resolvePdfObject<PdfImageData>(page, objId);
          imageCount += 1;
          const fileName = `p${pageNumber}-${imageCount}.png`;
          const saved = await saveImage(imageData, join(uploadDir, fileName));
          if (saved) {
            const boundingBox = boundingBoxFromMatrix(ctm);
            images.push({
              pageNumber,
              imageUrl: `${uploadId}/${fileName}`,
              boundingBox,
              caption: findCaption(boundingBox, textLines),
            });
          }
        } else if (fn === pdfjs.OPS.paintInlineImageXObject) {
          const [imageData] = args as [PdfImageData];
          imageCount += 1;
          const fileName = `p${pageNumber}-${imageCount}.png`;
          const saved = await saveImage(imageData, join(uploadDir, fileName));
          if (saved) {
            const boundingBox = boundingBoxFromMatrix(ctm);
            images.push({
              pageNumber,
              imageUrl: `${uploadId}/${fileName}`,
              boundingBox,
              caption: findCaption(boundingBox, textLines),
            });
          }
        }
      }
    }
  } finally {
    await loadingTask.destroy();
  }

  return images;
}
