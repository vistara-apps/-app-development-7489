import React, { useState, useRef, useEffect } from 'react'
import { Upload, Camera, X, Image, Trash2, AlertCircle, CheckCircle, Loader } from 'lucide-react'

export default function ImageUpload({ onImagesChange, maxImages = 5 }) {
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  // Clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const validateFile = (file) => {
    // Check file type
    if (!file.type.match('image.*')) {
      return { valid: false, message: 'Only image files are allowed' }
    }
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, message: 'File size exceeds 10MB limit' }
    }
    
    return { valid: true }
  }

  const handleFiles = (files) => {
    if (images.length >= maxImages) {
      setError(`Maximum of ${maxImages} images allowed`)
      return
    }

    setIsLoading(true)
    setError('')
    
    const remainingSlots = maxImages - images.length
    const newImages = Array.from(files).slice(0, remainingSlots)
    
    // Validate files
    for (const file of newImages) {
      const validation = validateFile(file)
      if (!validation.valid) {
        setError(validation.message)
        setIsLoading(false)
        return
      }
    }
    
    // Initialize progress for each file
    const newProgress = {}
    newImages.forEach(file => {
      newProgress[file.name] = 0
    })
    setUploadProgress(newProgress)
    
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        
        // Simulate progress
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20
          if (progress > 100) progress = 100
          
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.round(progress)
          }))
          
          if (progress === 100) {
            clearInterval(interval)
          }
        }, 200)
        
        reader.onload = (e) => {
          // Ensure 100% at the end
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }))
          
          setTimeout(() => {
            clearInterval(interval)
            resolve({
              id: Date.now() + Math.random(),
              file,
              preview: e.target.result,
              name: file.name,
              size: file.size
            })
          }, 500) // Small delay to show 100%
        }
        
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then(newImageObjects => {
      const updatedImages = [...images, ...newImageObjects]
      setImages(updatedImages)
      onImagesChange(updatedImages)
      setIsLoading(false)
      setUploadProgress({})
    })
  }

  const removeImage = (id) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }
  
  const removeAllImages = () => {
    setImages([])
    onImagesChange([])
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
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }
  
  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Upload area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
          dragActive
            ? 'border-accent bg-accent/10 shadow-md scale-[1.01]'
            : 'border-gray-300 hover:border-accent hover:bg-accent/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        role="button"
        tabIndex="0"
        aria-label="Upload images"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-hidden="true"
        />
        
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${dragActive ? 'bg-accent/20' : 'bg-gray-100'}`}>
            <Upload className="h-8 w-8 text-accent" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium text-text-primary">
              Upload job site photos
            </p>
            <p className="text-sm text-text-secondary mt-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-xs text-text-secondary mt-2">
              PNG, JPG up to 10MB each (max {maxImages} photos)
            </p>
            
            {images.length > 0 && (
              <div className="mt-3 inline-flex items-center text-sm text-accent">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>{images.length} of {maxImages} photos added</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Loading progress */}
      {isLoading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-3 animate-fade-in">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary truncate">{filename}</span>
                <span className="text-text-primary font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-text-primary">
              {images.length} {images.length === 1 ? 'Photo' : 'Photos'} Selected
            </h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeAllImages()
              }}
              className="text-red-500 hover:text-red-700 text-sm flex items-center"
              aria-label="Remove all images"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(image.id)
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200"
                  aria-label={`Remove ${image.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="text-white text-xs truncate">
                    {image.name}
                  </div>
                  <div className="text-white/80 text-xs">
                    {formatFileSize(image.size)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add more photos button (if under limit) */}
            {images.length < maxImages && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  triggerFileInput()
                }}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-text-secondary">Add More</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
