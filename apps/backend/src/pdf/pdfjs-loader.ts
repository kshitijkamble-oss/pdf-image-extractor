import type * as PdfJsLib from 'pdfjs-dist';

type PdfJsModule = typeof PdfJsLib;

// pdfjs-dist is ESM-only. With `module: commonjs`, TypeScript rewrites a
// plain `await import(...)` into `require(...)`, which cannot load an ESM
// package. Building the import through `Function` hides it from that
// rewrite, so it stays a real dynamic `import()` at runtime.
const dynamicImport = new Function(
  'specifier',
  'return import(specifier);',
) as (specifier: string) => Promise<PdfJsModule>;

let pdfjsModulePromise: Promise<PdfJsModule> | undefined;

export function loadPdfjs(): Promise<PdfJsModule> {
  pdfjsModulePromise ??= dynamicImport('pdfjs-dist/legacy/build/pdf.mjs');
  return pdfjsModulePromise;
}
