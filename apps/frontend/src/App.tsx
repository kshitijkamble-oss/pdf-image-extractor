import { useEffect, useRef, useState } from 'react'
import type { ExtractedPhoto } from '@repo/shared'
import { uploadPdf } from './api'
import './App.css'

const isPdf = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

const hasFiles = (e: globalThis.DragEvent) =>
  e.dataTransfer?.types.includes('Files') ?? false

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

  // The whole window is the drop zone; preventDefault stops the browser
  // from opening a dropped PDF in the tab.
  useEffect(() => {
    const dialogOpen = () => dialogRef.current?.open ?? false

    const onDragEnter = (e: globalThis.DragEvent) => {
      if (!hasFiles(e) || dialogOpen()) return
      dragCounter.current += 1
      setDragging(true)
    }

    const onDragLeave = (e: globalThis.DragEvent) => {
      if (!hasFiles(e) || dialogOpen()) return
      dragCounter.current = Math.max(dragCounter.current - 1, 0)
      if (dragCounter.current === 0) setDragging(false)
    }

    const onDragOver = (e: globalThis.DragEvent) => {
      if (hasFiles(e)) e.preventDefault()
    }

    const onDrop = (e: globalThis.DragEvent) => {
      if (!hasFiles(e)) return
      e.preventDefault()
      dragCounter.current = 0
      setDragging(false)
      if (dialogOpen()) return
      const dropped = e.dataTransfer?.files[0]
      if (!dropped) return
      if (isPdf(dropped)) {
        if (fileInputRef.current) fileInputRef.current.value = ''
        setFile(dropped)
        setPhotos([])
        setOpenIndex(null)
        setError(null)
        setDone(false)
        setResultName(null)
      } else setError('Please drop a PDF file.')
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
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
      <header className="app-header">
        <h1>PDF Photo Extractor</h1>
        <p className="tagline">Pull every photo out of a PDF.</p>
      </header>
      <section className="upload-panel">
        <div className="drop-area">
          <svg
            className="drop-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 15V4" />
            <path d="M7.5 8.5L12 4l4.5 4.5" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
          </svg>
          <p className="drop-text">Drop a PDF anywhere, or</p>
          <label className="choose-button">
            Choose a PDF
            <input
              ref={fileInputRef}
              className="visually-hidden"
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <div className="file-row">
          {file ? (
            <p className="file-name">{file.name}</p>
          ) : (
            <p className="file-placeholder">No file chosen</p>
          )}
          <button
            type="button"
            className="primary-button"
            disabled={!file || loading || done}
            onClick={handleSubmit}
          >
            {loading ? 'Extracting…' : done ? 'Extracted ✓' : 'Extract photos'}
          </button>
        </div>
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
      {dragging && (
        <div className="drop-overlay" aria-hidden="true">
          Drop your PDF to select it
        </div>
      )}
    </main>
  )
}

export default App
