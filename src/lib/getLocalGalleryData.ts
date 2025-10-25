import path from "path"
import { promises as fs } from "fs"
import type { LocalGallery, LocalGalleryImage } from "@/types/gallery"

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tiff",
  ".heic",
  ".heif",
])

const COLLECTIONS = [
  { id: "metal", title: "Metal" },
  { id: "tarım", title: "Agriculture" },
]

const toPublicUrl = (folder: string, file: string) => {
  const encodedFolder = encodeURIComponent(folder)
  const encodedFile = encodeURIComponent(file)
  return `/${encodedFolder}/${encodedFile}`
}

const isImageFile = (fileName: string) => {
  const ext = path.extname(fileName).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext)
}

const sortNumeric = (a: string, b: string) => {
  const numA = parseInt(a, 10)
  const numB = parseInt(b, 10)
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return numA - numB
  }
  return a.localeCompare(b)
}

export async function getLocalGalleryData(): Promise<LocalGallery[]> {
  const publicDir = path.join(process.cwd(), "public")

  const collectionImages: Record<string, LocalGalleryImage[]> = {}

  for (const collection of COLLECTIONS) {
    const folderPath = path.join(publicDir, collection.id)

    let files: string[] = []
    try {
      files = await fs.readdir(folderPath)
    } catch (error) {
      console.warn(`Unable to read gallery folder: ${collection.id}`, error)
      collectionImages[collection.id] = []
      continue
    }

    const sortedFiles = files
      .filter((file) => isImageFile(file))
      .sort(sortNumeric)

    collectionImages[collection.id] = sortedFiles.map((file, index) => ({
      id: `${collection.id}-${index + 1}`,
      url: toPublicUrl(collection.id, file),
      title: collection.title,
    }))
  }

  const interleavedImages: LocalGalleryImage[] = []
  const lengths = COLLECTIONS.map(
    (collection) => collectionImages[collection.id]?.length ?? 0
  )
  const maxLength = lengths.length ? Math.max(...lengths) : 0

  for (let i = 0; i < maxLength; i++) {
    COLLECTIONS.forEach((collection) => {
      const images = collectionImages[collection.id] ?? []
      const image = images[i]
      if (image) {
        interleavedImages.push(image)
      }
    })
  }

  const gallery: LocalGallery = {
    id: "local-gallery",
    title: "Gallery",
    description: "Highlights from metal and agriculture.",
    images: interleavedImages,
  }

  return [gallery]
}

export type { LocalGallery, LocalGalleryImage }
