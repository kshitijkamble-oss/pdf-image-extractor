import type * as PdfJsLib from 'pdfjs-dist';

type PdfJsModule = typeof PdfJsLib;

declare global {
  var pdfjsWorker: { WorkerMessageHandler: unknown } | undefined;
}

let pdfjsModulePromise: Promise<PdfJsModule> | undefined;

async function load(): Promise<PdfJsModule> {
  // Vercel only bundles files it can trace; pdfjs builds the worker path at runtime, so preload it with a literal import.
  // https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/12
  const { WorkerMessageHandler } = await import('pdfjs-dist/legacy/build/pdf.worker.mjs');
  globalThis.pdfjsWorker = { WorkerMessageHandler };
  return (await import('pdfjs-dist/legacy/build/pdf.mjs')) as PdfJsModule;
}

export function loadPdfjs(): Promise<PdfJsModule> {
  pdfjsModulePromise ??= load();
  return pdfjsModulePromise;
}
