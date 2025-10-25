export interface LocalGalleryImage {
  id: string
  url: string
  title?: string
}

export interface LocalGallery {
  id: string
  title: string
  description?: string
  images: LocalGalleryImage[]
}
