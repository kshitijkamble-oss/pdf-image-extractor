import { useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { ExtractedPhoto } from '@repo/shared'
import { uploadPdf } from './api'
import './App.css'

const isPdf = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

const fileNameFromUrl = (url: string) =>
  url.split('?')[0].split('/').pop() ?? 'photo.png'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [photos, setPhotos] = useState<ExtractedPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [resultName, setResultName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragCounter = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openPhoto = openIndex === null ? undefined : photos[openIndex]

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openIndex !== null && !dialog.open) dialog.showModal()
    if (openIndex === null && dialog.open) dialog.close()
  }, [openIndex])

  // Without this, a PDF dropped outside the panel would open in the tab.
  useEffect(() => {
    const preventFileDrag = (e: globalThis.DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault()
    }
    window.addEventListener('dragover', preventFileDrag)
    window.addEventListener('drop', preventFileDrag)
    return () => {
      window.removeEventListener('dragover', preventFileDrag)
      window.removeEventListener('drop', preventFileDrag)
    }
  }, [])

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
    setDone(false)
    setResultName(null)
  }

  const hasFiles = (e: { dataTransfer: DataTransfer | null }) =>
    e.dataTransfer?.types.includes('Files') ?? false

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    if (!hasFiles(e)) return
    dragCounter.current += 1
    setDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    if (!hasFiles(e)) return
    dragCounter.current = Math.max(dragCounter.current - 1, 0)
    if (dragCounter.current === 0) setDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    if (hasFiles(e)) e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    if (!hasFiles(e)) return
    e.preventDefault()
    dragCounter.current = 0
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (!dropped) return
    if (isPdf(dropped)) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      handleFileChange(dropped)
    } else setError('Please drop a PDF file.')
  }

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setDone(false)
    try {
      const result = await uploadPdf(file)
      setPhotos(result)
      setDone(true)
      setResultName(file.name)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <section
        className={dragging ? 'upload-panel dragging' : 'upload-panel'}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h1>PDF Photo Extractor</h1>
        <p className="upload-hint">Drop a PDF here or choose one</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        />
        {file && <p className="file-name">{file.name}</p>}
        <button
          type="button"
          disabled={!file || loading || done}
          onClick={handleSubmit}
        >
          {loading ? 'Extracting…' : done ? 'Extracted ✓' : 'Extract photos'}
        </button>
      </section>
      {error && <p className="error">{error}</p>}
      {done && !loading && !error && resultName && (
        photos.length > 0 ? (
          <p className="status">
            Found {photos.length} {photos.length === 1 ? 'photo' : 'photos'} in{' '}
            {resultName}
          </p>
        ) : (
          <p className="status empty">
            No photos found in {resultName}. This PDF has no embedded images —
            try another PDF.
          </p>
        )
      )}
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
