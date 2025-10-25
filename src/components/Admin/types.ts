export interface GalleryImage {
    id?: string;
    gallery_id?: string;
    url: string;
    alt_text?: string;
    title?: string;
    is_cover_photo?: boolean;
    created_at?: string;
    location?: string;
  }
  
  export interface GalleryItem {
    id: string;
    title: string;
    subtitle: string;
    location: string;
    url: string;
  }