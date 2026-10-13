import type { ExtractedPhoto } from '@repo/shared'

export async function uploadPdf(file: File): Promise<ExtractedPhoto[]> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/pdf/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? response.statusText)
  }

  return response.json() as Promise<ExtractedPhoto[]>
}
