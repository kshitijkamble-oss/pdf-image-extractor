import { useState } from 'react'
import type { ExtractedPhoto } from '@repo/shared'
import { uploadPdf } from './api'
import './App.css'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [photos, setPhotos] = useState<ExtractedPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (newFile: File | null) => {
    setFile(newFile)
    setPhotos([])
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
            <div className="photo-card" key={`${photo.imageUrl}-${i}`}>
              <img
                src={photo.imageUrl}
                alt={photo.caption || `Photo from page ${photo.pageNumber}`}
              />
              <p className="page-number">Page {photo.pageNumber}</p>
              {photo.caption && <p className="caption">{photo.caption}</p>}
              {photo.description && photo.description !== photo.caption && (
                <p className="description">{photo.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default App
