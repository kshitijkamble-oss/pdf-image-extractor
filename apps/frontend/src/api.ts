import { uploadPresigned } from '@vercel/blob/client'
import type { ExtractedPhoto } from '@repo/shared'
import { getTurnstileToken } from './turnstile'

type ErrorBody = { message?: string } | null

async function throwResponseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorBody
  throw new Error(body?.message ?? response.statusText)
}

function toBlobPathname(fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, '').replace(/[^A-Za-z0-9._-]/g, '').replace(/^\.+/, '')
  return `pdf-uploads/${base || 'upload'}.pdf`
}

// uploadPresigned() hides the status and body of a failed presigned URL request, so ask the token route directly.
async function isClientUploadConfigured(): Promise<boolean> {
  const response = await fetch('/api/pdf/blob-token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  return response.status !== 501
}

// @vercel/blob/client does not export BlobError, so the only way to spot this failure is its exact message.
const PRESIGNED_URL_FAILED = 'Vercel Blob: Failed to retrieve the presigned URL'

async function uploadPdfMultipart(file: File): Promise<ExtractedPhoto[]> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/pdf/upload', {
    method: 'POST',
    headers: { 'x-turnstile-token': await getTurnstileToken() },
    body: formData,
  })

  if (!response.ok) await throwResponseError(response)

  return response.json() as Promise<ExtractedPhoto[]>
}

export async function uploadPdf(file: File): Promise<ExtractedPhoto[]> {
  if (!(await isClientUploadConfigured())) return uploadPdfMultipart(file)

  const turnstileToken = await getTurnstileToken()
  const blob = await uploadPresigned(toBlobPathname(file.name), file, {
    access: 'private',
    handleUploadUrl: '/api/pdf/blob-token',
    contentType: 'application/pdf',
    headers: { 'x-turnstile-token': turnstileToken },
  }).catch((error: unknown) => {
    if (error instanceof Error && error.message === PRESIGNED_URL_FAILED) {
      throw new Error('Upload failed. Please reload the page and try again.')
    }
    throw error
  })

  const response = await fetch('/api/pdf/extract', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pathname: blob.pathname }),
  })

  if (!response.ok) await throwResponseError(response)

  return response.json() as Promise<ExtractedPhoto[]>
}
