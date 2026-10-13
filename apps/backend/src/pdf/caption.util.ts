export interface CaptionBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CaptionTextLine {
  text: string;
  boundingBox: CaptionBoundingBox;
}

const MAX_VERTICAL_GAP_PT = 40;
const FIGURE_PREFIXES = ['figure', 'fig.', 'photo', 'image', 'plate'];

function hasFigurePrefix(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  return FIGURE_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function overlapsHorizontally(
  a: CaptionBoundingBox,
  b: CaptionBoundingBox,
): boolean {
  return a.x < b.x + b.width && b.x < a.x + a.width;
}

interface LineCandidate {
  line: CaptionTextLine;
  gap: number;
}

function closestLine(
  imageBox: CaptionBoundingBox,
  lines: CaptionTextLine[],
  direction: 'below' | 'above',
): CaptionTextLine | undefined {
  const candidates: LineCandidate[] = [];

  for (const line of lines) {
    if (!overlapsHorizontally(imageBox, line.boundingBox)) continue;

    const gap =
      direction === 'below'
        ? imageBox.y - (line.boundingBox.y + line.boundingBox.height)
        : line.boundingBox.y - (imageBox.y + imageBox.height);

    if (gap >= 0 && gap <= MAX_VERTICAL_GAP_PT) {
      candidates.push({ line, gap });
    }
  }

  if (candidates.length === 0) {
    return undefined;
  }

  candidates.sort((a, b) => a.gap - b.gap);

  const figureCandidate = candidates.find((candidate) =>
    hasFigurePrefix(candidate.line.text),
  );
  return (figureCandidate ?? candidates[0]).line;
}

export function findCaption(
  imageBox: CaptionBoundingBox,
  lines: CaptionTextLine[],
): string {
  return (
    closestLine(imageBox, lines, 'below')?.text ??
    closestLine(imageBox, lines, 'above')?.text ??
    ''
  );
}
