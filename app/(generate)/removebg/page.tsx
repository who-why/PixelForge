"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, ImageIcon, Loader2, Download, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ImageActions from "@/components/common/ImageActions";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setError(null)

      // Create preview URL for the original image
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setImageUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", selectedFile)

    try {
      const response = await fetch("/api/removebg", {
        method: "POST",
        body: formData,
      })

      // Check if the response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          "The API endpoint returned an invalid response format. Make sure the /api/removebg endpoint is properly implemented.",
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image")
      }

      if (data.imageUrl) {
        setImageUrl(data.imageUrl)
        
        // Save the background-removed image
        await fetch('/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            imageUrl: data.imageUrl,
            type: 'removebg'
          }),
        });
      } else {
        setError("Failed to get the processed image URL")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error instanceof Error ? error.message : "Something went wrong with the API request!")
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Magic Background Remover
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Upload an image and watch the magic happen! Our AI-powered tool removes backgrounds instantly.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
              <div className="flex flex-col items-center">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full max-w-md mb-6">
                  <div
                    onClick={triggerFileInput}
                    className="w-full py-6 px-8 bg-white dark:bg-slate-800 border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl flex items-center justify-center gap-4 cursor-pointer transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-base font-medium text-slate-800 dark:text-slate-200">Select an image</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  </div>
                </motion.div>

                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-slate-500 dark:text-slate-400 mb-4"
                  >
                    Selected: {selectedFile.name}
                  </motion.div>
                )}

                <AnimatePresence>
                  {selectedFile && !loading && !imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        onClick={handleUpload}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full flex items-center gap-2 shadow-md"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Remove Background</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3 my-4"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                      >
                        <Loader2 className="h-8 w-8 text-purple-600" />
                      </motion.div>
                      <p className="text-slate-600 dark:text-slate-300">Processing your image...</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-8"
              >
                <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(previewUrl || imageUrl) && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {previewUrl && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden border bg-gray-100 border-slate-200 dark:border-slate-700 rounded-xl shadow-md">
                      <div className="p-4 text-gray-700">
                        <h3 className="font-medium text-center">Original Image</h3>
                      </div>
                      <div className="relative p-4 flex items-center justify-center">
                        <div className="rounded-lg overflow-hidden shadow-inner h-full w-full flex items-center justify-center">
                          <img
                            src={previewUrl || "/placeholder.svg"}
                            alt="Original"
                            className="max-w-full max-h-full object-contain rounded-lg border"
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="overflow-hidden border bg-gray-100 rounded-xl shadow-md">
                      <div className="px-4 py-3 text-gray-800 flex justify-between items-center">
                        <h3 className="font-medium">Background Removed</h3>
                        <div className="flex items-center gap-2">
                          <ImageActions 
                            imageUrl={imageUrl} 
                            fileName="background-removed"
                          />
                        </div>
                      </div>
                      <div className="relative p-4 flex items-center justify-center">
                        <div className="bg-[url('/placeholder.svg?height=400&width=400')] bg-center rounded-lg overflow-hidden shadow-inner h-full w-full flex items-center justify-center">
                          <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={imageUrl}
                            alt="Background Removed"
                            className="max-w-full max-h-full object-contain border rounded-lg"
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

