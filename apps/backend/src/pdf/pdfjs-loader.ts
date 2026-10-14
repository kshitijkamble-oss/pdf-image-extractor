import type * as PdfJsLib from 'pdfjs-dist';

type PdfJsModule = typeof PdfJsLib;

let pdfjsModulePromise: Promise<PdfJsModule> | undefined;

export function loadPdfjs(): Promise<PdfJsModule> {
  pdfjsModulePromise ??= import('pdfjs-dist/legacy/build/pdf.mjs') as Promise<PdfJsModule>;
  return pdfjsModulePromise;
}
