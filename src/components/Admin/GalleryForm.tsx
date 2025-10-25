"use client";

import React, { useState, useRef } from 'react';
import { GalleryItem, GalleryImage } from '../Admin/types';

interface Gallery extends Omit<GalleryItem, 'location' | 'subtitle' | 'url'> {
    description: string;
    images?: GalleryImage[];
    locations?: string[];
}

interface GalleryFormProps {
    gallery?: Gallery;
    onSubmit: (gallery: Omit<Gallery, 'id' | 'images'>, imageFiles: File[], coverImageIndex: number) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

export const GalleryForm: React.FC<GalleryFormProps> = ({ gallery, onSubmit, onCancel, loading }) => {
    const [title, setTitle] = useState(gallery?.title || '');
    const [description, setDescription] = useState(gallery?.description || '');
    const [images, setImages] = useState<GalleryImage[]>(gallery?.images || []);
    const [coverImageIndex, setCoverImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [currentStep, setCurrentStep] = useState(1);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setImageFiles(prevFiles => [...prevFiles, ...files]);
            
            const newImageObjects = files.map(file => ({
                url: URL.createObjectURL(file),
                location: ""
            }));
            
            setImages(prevImages => [...prevImages, ...newImageObjects]);
        }
    };

    const handleLocationChange = (index: number, location: string) => {
        const updatedImages = [...images];
        updatedImages[index].location = location;
        setImages(updatedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0 && !gallery) {
            alert("Please select at least one image.");
            return;
        }

        const locations = images.map(img => img.location || "");

        await onSubmit(
            { 
                title, 
                description,
                locations
            },
            imageFiles,
            coverImageIndex
        );
    };

    const handleClearImages = () => {
        setImages([]);
        setImageFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setCoverImageIndex(0);
    };

    const handleAddImage = () => {
        setImages([...images, { url: "", location: "" }]);
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };
    
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };
    
    const renderStepOne = () => {
        return (
            <div className="space-y-5">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        rows={3}
                    />
                </div>
                <div className="mt-6 flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={!title.trim()}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };
    
    const renderStepTwo = () => {
        return (
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Images
                    </label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            id="imageInput"
                            ref={fileInputRef}
                        />
                        <label
                            htmlFor="imageInput"
                            className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                            Select Images
                        </label>
                        {images.length > 0 && (
                            <button
                                type="button"
                                onClick={handleClearImages}
                                className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Clear Images
                            </button>
                        )}
                    </div>
                    
                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image.url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="mt-6 flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={nextStep}
                        disabled={images.length === 0}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                    >
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };
    
    const renderStepThree = () => {
        return (
            <div className="space-y-5">
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Review and Finalize</h3>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Set image locations and choose a cover image:
                    </p>
                    <div className="space-y-4">
                        {images.map((image, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-3 border border-gray-200 rounded-md">
                                <div className="relative">
                                    <img
                                        src={image.url}
                                        alt={`Image ${index + 1}`}
                                        className={`w-32 h-32 object-cover rounded-md ${coverImageIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                        onClick={() => setCoverImageIndex(index)}
                                    />
                                    {coverImageIndex === index && (
                                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={image.location}
                                            onChange={(e) => handleLocationChange(index, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter image location"
                                        />
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setCoverImageIndex(index)}
                                            className={`mr-3 px-3 py-1 text-sm ${coverImageIndex === index ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} rounded-md`}
                                        >
                                            {coverImageIndex === index ? 'Cover Image ✓' : 'Set as Cover'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            "Save Gallery"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            1
                        </div>
                        <div className={`ml-2 text-sm ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Basic Info</div>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            2
                        </div>
                        <div className={`ml-2 text-sm ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Upload Images</div>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            3
                        </div>
                        <div className={`ml-2 text-sm ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Review & Finalize</div>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStepOne()}
                {currentStep === 2 && renderStepTwo()}
                {currentStep === 3 && renderStepThree()}
            </form>
        </div>
    );
};