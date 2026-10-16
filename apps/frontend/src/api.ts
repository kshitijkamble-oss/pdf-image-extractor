import { upload } from '@vercel/blob/client'
import type { ExtractedPhoto } from '@repo/shared'

const MULTIPART_THRESHOLD_BYTES = 5 * 1024 * 1024

type ErrorBody = { message?: string } | null

async function throwResponseError(response: Response): Promise<never> {
  const body = (await response.json().catch(() => null)) as ErrorBody
  throw new Error(body?.message ?? response.statusText)
}

function toBlobPathname(fileName: string): string {
  const base = fileName.replace(/\.pdf$/i, '').replace(/[^A-Za-z0-9._-]/g, '').replace(/^\.+/, '')
  return `pdf-uploads/${base || 'upload'}.pdf`
}

// upload() hides the status and body of a failed token request, so ask the token route directly.
async function isClientUploadConfigured(): Promise<boolean> {
  const response = await fetch('/api/pdf/blob-token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}',
  })
  return response.status !== 501
}

async function uploadPdfMultipart(file: File): Promise<ExtractedPhoto[]> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/pdf/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) await throwResponseError(response)

  return response.json() as Promise<ExtractedPhoto[]>
}

export async function uploadPdf(file: File): Promise<ExtractedPhoto[]> {
  if (!(await isClientUploadConfigured())) return uploadPdfMultipart(file)

  const blob = await upload(toBlobPathname(file.name), file, {
    access: 'private',
    handleUploadUrl: '/api/pdf/blob-token',
    contentType: 'application/pdf',
    multipart: file.size > MULTIPART_THRESHOLD_BYTES,
  })

  const response = await fetch('/api/pdf/extract', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ pathname: blob.pathname }),
  })

  if (!response.ok) await throwResponseError(response)

  return response.json() as Promise<ExtractedPhoto[]>
}
