"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2, MapPin, Search, Image } from 'lucide-react';
import { GalleryForm } from '../../components/Admin/GalleryForm';
import { DeleteConfirmModal } from '../../components/Admin/DeleteConfirmationModal';
import { GalleryItem, GalleryImage } from '../../components/Admin/types';

interface Gallery extends Omit<GalleryItem, 'location' | 'subtitle' | 'url'> {
  description: string;
  images: GalleryImage[];
  cover_image_id?: string;
  locations?: string[];
}

function App() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [deleteGallery, setDeleteGallery] = useState<Gallery | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGalleries(data);
    } catch (e: any) {
      console.error("Failed to fetch gallery items:", e);
      setError("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddGallery = async (newGallery: Omit<Gallery, 'id' | 'images' | 'cover_image_id'>, imageFiles: File[], coverImageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("title", newGallery.title);
      formData.append("description", newGallery.description);
      formData.append("coverImageIndex", coverImageIndex.toString());

      if (newGallery.locations) {
        formData.append("locations", JSON.stringify(newGallery.locations));
      }

      imageFiles.forEach(imageFile => {
        formData.append("images", imageFile);
      });

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchData();
      setIsFormOpen(false);

    } catch (e: any) {
      console.error("Failed to add gallery item:", e);
      setError("Failed to add item.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGallery = async (updatedGallery: Omit<Gallery, 'id' | 'images' | 'cover_image_id'>, newImageFiles: File[], coverImageIndex: number) => {
    if (!editingGallery) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", updatedGallery.title);
      formData.append("description", updatedGallery.description);
      formData.append("coverImageIndex", coverImageIndex.toString());

      if (updatedGallery.locations) {
        formData.append("locations", JSON.stringify(updatedGallery.locations));
      }

      newImageFiles.forEach(imageFile => {
        formData.append("newImages", imageFile);
      });

      const response = await fetch(`/api/gallery?id=${editingGallery.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchData();
      setEditingGallery(null);

    } catch (e: any) {
      console.error("Failed to edit gallery item:", e);
      setError("Failed to update item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteGallery) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gallery?id=${deleteGallery.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchData();
      setDeleteGallery(null);

    } catch (e: any) {
      console.error("Failed to delete gallery item:", e);
      setError("Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = useMemo(() => {
    if (!searchQuery.trim()) return galleries;

    const query = searchQuery.toLowerCase();
    return galleries.filter(gallery =>
      gallery.title.toLowerCase().includes(query) ||
      gallery.description?.toLowerCase().includes(query)
    );
  }, [galleries, searchQuery]);

  const getCoverImageUrl = (gallery: Gallery): string | undefined => {
    const coverImage = gallery.images.find(img => img.is_cover_photo);
    return coverImage?.url;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
              <p className="text-gray-600 mt-1">
                Total galleries: <span className="font-medium">{galleries.length}</span>
                {searchQuery && (
                  <span className="ml-2">
                    (Showing {filteredGalleries.length} {filteredGalleries.length === 1 ? 'result' : 'results'})
                  </span>
                )}
              </p>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              <Plus size={20} />
              Add New Gallery
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={loading}
            />
          </div>
        </div>

        {(isFormOpen || editingGallery) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                {editingGallery ? 'Edit Gallery' : 'Add New Gallery'}
              </h2>
              <GalleryForm
                gallery={editingGallery || undefined}
                onSubmit={editingGallery ? handleEditGallery : handleAddGallery}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingGallery(null);
                }}
                loading={loading}
              />
            </div>
          </div>
        )}

        <DeleteConfirmModal
          isOpen={!!deleteGallery}
          onClose={() => setDeleteGallery(null)}
          onConfirm={handleDeleteConfirm}
          itemTitle={deleteGallery?.title || ''}
          loading={loading}
          itemType="gallery"
        />

        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGalleries.map(gallery => {
              const coverImageUrl = getCoverImageUrl(gallery);
              return (
                <div
                  key={gallery.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
                >
                  <div className="relative aspect-video">
                    {coverImageUrl ? (
                      <img
                        src={coverImageUrl}
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Image size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => setEditingGallery(gallery)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        disabled={loading}
                      >
                        <Pencil size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => setDeleteGallery(gallery)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        disabled={loading}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{gallery.title}</h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">{gallery.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {galleries.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              No galleries yet. Click "Add New Gallery" to get started.
            </p>
          </div>
        )}

        {galleries.length > 0 && filteredGalleries.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-base sm:text-lg">
              No galleries found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;