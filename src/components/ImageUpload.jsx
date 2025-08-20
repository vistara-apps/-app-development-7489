import React, { useState, useRef } from 'react'
import { Upload, Camera, X, Image } from 'lucide-react'

export default function ImageUpload({ onImagesChange, maxImages = 5 }) {
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleFiles = (files) => {
    const newImages = Array.from(files).slice(0, maxImages - images.length)
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result,
            name: file.name
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then(newImageObjects => {
      const updatedImages = [...images, ...newImageObjects]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    })
  }

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-accent bg-accent/5'
            : 'border-gray-300 hover:border-accent'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <p className="text-sm font-medium text-text-primary">
              Upload job site photos
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-text-secondary mt-2">
              PNG, JPG up to 10MB each (max {maxImages} photos)
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                  {image.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}