"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage } from "@/components/Admin/types"
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
  gallery: {
    title: string
    images: GalleryImage[]
  } | null
  currentImageIndex: number
  onPrevImage: () => void
  onNextImage: () => void
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  gallery,
  currentImageIndex,
  onPrevImage,
  onNextImage,
}) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowLeft") onPrevImage()
      if (e.key === "ArrowRight") onNextImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onPrevImage, onNextImage])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) onNextImage()
    if (isRightSwipe) onPrevImage()

    setTouchStart(null)
    setTouchEnd(null)
  }

  if (!gallery) return null

  const currentImage = gallery.images[currentImageIndex]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/40 backdrop-blur-md" />
      <DialogContent
        className="max-w-[90%] max-h-[90%] h-[90vh] w-[90vw] p-0 border-white/20 bg-white/10 backdrop-blur-md shadow-xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="hidden">Gallery</DialogTitle>
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-100 border border-white/20 hover:scale-110"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="absolute top-4 left-4 z-40 p-3 rounded-lg bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all duration-100">
            <h3 className="text-lg font-medium">{gallery.title}</h3>
            <p className="text-sm text-gray-300">
              Image {currentImageIndex + 1} of {gallery.images.length}
            </p>
          </div>

          <div
            className="w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{
                  duration: 0.1,
                  ease: [0.19, 1, 0.22, 1],
                  opacity: { duration: 0.1 },
                  scale: { duration: 0.2 },
                }}
                className="relative w-full h-full"
                style={{ position: 'relative' }} /* Ensure position is explicitly set for Image with fill prop */
              >
                {currentImage && (
                  <Image
                    src={currentImage.url || "/placeholder.svg"}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {gallery.images.length > 1 && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4 z-40">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={onPrevImage}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-100 border border-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={onNextImage}
                className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-100 border border-white/20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          )}

          {gallery.images.length > 1 && (
            <>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-white/20 to-transparent backdrop-blur-sm pointer-events-none"
              />

              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="absolute bottom-0 inset-x-0 overflow-x-auto pb-4 px-4 flex gap-2 items-center"
              >
                {gallery.images.map((image, index) => (
                  <motion.button
                    key={image.id}
                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.8)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (index < currentImageIndex) {
                        for (let i = currentImageIndex; i > index; i--) {
                          onPrevImage()
                        }
                      } else if (index > currentImageIndex) {
                        for (let i = currentImageIndex; i < index; i++) {
                          onNextImage()
                        }
                      }
                    }}
                    className={`relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-100 ${
                      currentImageIndex === index
                        ? "border-white scale-105"
                        : "border-transparent opacity-70 hover:opacity-90"
                    }`}
                    style={{ position: 'relative' }} /* Ensure position is explicitly set for Image with fill prop */
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GalleryModal