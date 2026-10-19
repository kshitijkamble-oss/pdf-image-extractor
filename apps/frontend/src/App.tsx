import { useEffect, useRef, useState } from 'react'
import type { ExtractedPhoto } from '@repo/shared'
import { uploadPdf } from './api'
import './App.css'

const fileNameFromUrl = (url: string) =>
  url.split('?')[0].split('/').pop() ?? 'photo.png'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [photos, setPhotos] = useState<ExtractedPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openPhoto = openIndex === null ? undefined : photos[openIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openIndex !== null && !dialog.open) dialog.showModal()
    if (openIndex === null && dialog.open) dialog.close()
  }, [openIndex])

  const showPhoto = (step: number) => {
    setOpenIndex((current) => {
      if (current === null) return null
      return Math.min(Math.max(current + step, 0), photos.length - 1)
    })
  }

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile)
    setPhotos([])
    setOpenIndex(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const result = await uploadPdf(file)
      setPhotos(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>PDF Photo Extractor</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />
      <button type="button" disabled={!file || loading} onClick={handleSubmit}>
        {loading ? 'Extracting…' : 'Submit'}
      </button>
      {error && <p className="error">{error}</p>}
      {photos.length > 0 && (
        <div className="photo-grid">
          {photos.map((photo, i) => (
            <div
              className="photo-card"
              key={`${photo.imageUrl}-${i}`}
              onClick={() => setOpenIndex(i)}
            >
              <button type="button" className="photo-open">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Photo from page ${photo.pageNumber}`}
                />
              </button>
              <p className="page-number">Page {photo.pageNumber}</p>
              {photo.caption && <p className="caption">{photo.caption}</p>}
              {photo.description && photo.description !== photo.caption && (
                <p className="description">{photo.description}</p>
              )}
              <a
                className="download-button"
                href={photo.downloadUrl}
                download={fileNameFromUrl(photo.imageUrl)}
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
      <dialog
        className="photo-dialog"
        ref={dialogRef}
        onClose={() => setOpenIndex(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenIndex(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') showPhoto(-1)
          if (e.key === 'ArrowRight') showPhoto(1)
        }}
      >
        {openPhoto && openIndex !== null && (
          <div className="photo-dialog-content">
            <button
              type="button"
              className="photo-dialog-close"
              aria-label="Close"
              onClick={() => setOpenIndex(null)}
            >
              ×
            </button>
            <img
              src={openPhoto.imageUrl}
              alt={
                openPhoto.caption || `Photo from page ${openPhoto.pageNumber}`
              }
            />
            {openPhoto.caption && <p className="caption">{openPhoto.caption}</p>}
            <p className="page-number">Page {openPhoto.pageNumber}</p>
            <div className="photo-dialog-actions">
              <button
                type="button"
                aria-label="Previous photo"
                disabled={openIndex === 0}
                onClick={() => showPhoto(-1)}
              >
                ‹
              </button>
              <a
                className="download-button"
                href={openPhoto.downloadUrl}
                download={fileNameFromUrl(openPhoto.imageUrl)}
              >
                Download
              </a>
              <button
                type="button"
                aria-label="Next photo"
                disabled={openIndex === photos.length - 1}
                onClick={() => showPhoto(1)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </dialog>
    </main>
  )
}

export default App
