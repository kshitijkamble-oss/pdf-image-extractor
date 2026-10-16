# Ideate — download-photo

_Entered 2026-10-16._

- **Problem:** photos are shown but can't be downloaded with one click.
- **For whom:** anyone who uploads a PDF to get its photos out — that is the app's main job.
- **Quality:** the stored PNG is already full pixel size and lossless (`apps/backend/src/pdf/pdf-image-extractor.ts` `encodeImage`). Colours are converted to RGB, so CMYK/ICC print colours are not kept. User chose to download the stored PNG (option 1) over the original PDF bytes (option 2), 2026-10-16.
- **Success:** on production, clicking Download saves the PNG with the same pixel size and bytes as the stored file, with a sensible file name, instead of opening it in a tab.
