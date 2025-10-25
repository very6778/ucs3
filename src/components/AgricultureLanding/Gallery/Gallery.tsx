"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import type { GalleryImage } from "@/components/Admin/types";
import GalleryModal from "./GalleryModal";

import type SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import EffectMaterial from "./effect-material.esm";
import "./styles.css";

import "swiper/css";
import "swiper/css/bundle";

interface GalleryData {
  id: string;
  title: string;
  description: string;
  images: GalleryImage[];
  cover_image_id?: string;
}

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState<GalleryData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("...");
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [slide1Animated, setSlide1Animated] = useState(false);
  const [slide2Animated, setSlide2Animated] = useState(false);
  const [slide3Animated, setSlide3Animated] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const isSlideInView = useInView(slideRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize, { passive: true });

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current || galleries.length === 0 || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTimeout(() => {
            controls.start("visible");
            setHasAnimated(true);
            observer.unobserve(entry.target);
          }, 50);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, controls, hasAnimated, galleries]);

  useEffect(() => {
    if (isSlideInView) {
      const timeoutId = setTimeout(() => {
        setSlide1Animated(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isSlideInView]);

  useEffect(() => {
    if (slide1Animated) {
      const timeoutId = setTimeout(() => {
        setSlide2Animated(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [slide1Animated]);

  useEffect(() => {
    if (slide2Animated) {
      const timeoutId = setTimeout(() => {
        setSlide3Animated(true);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [slide2Animated]);

  const fetchGalleryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Supabase bağlantısını Partytown ile web worker'da yapalım
      if (window.partytown) {
        const fetchData = () => {
          return new Promise((resolve) => {
            // Web worker içinde çalıştırılacak kod
            const script = document.createElement('script');
            script.type = 'text/partytown';
            script.innerHTML = `
              (async function() {
                try {
                  const response = await fetch("/api/gallery");
                  if (!response.ok) {
                    throw new Error("HTTP error! status: " + response.status);
                  }
                  const data = await response.json();
                  window.dispatchEvent(new CustomEvent('gallery-data-loaded', { 
                    detail: { data: data } 
                  }));
                } catch (e) {
                  window.dispatchEvent(new CustomEvent('gallery-data-error', { 
                    detail: { error: e.message } 
                  }));
                }
              })();
            `;
            
            // Custom event tiplerini tanımlayalım
            type GalleryDataLoadedEvent = CustomEvent<{data: GalleryData[]}>;
            type GalleryDataErrorEvent = CustomEvent<{error: string}>;
            
            // Event listener'ları ekleyelim
            const successHandler = ((e: Event) => {
              const customEvent = e as GalleryDataLoadedEvent;
              resolve(customEvent.detail.data);
              window.removeEventListener('gallery-data-loaded', successHandler);
              window.removeEventListener('gallery-data-error', errorHandler);
              document.body.removeChild(script);
            }) as EventListener;
            
            const errorHandler = ((e: Event) => {
              const customEvent = e as GalleryDataErrorEvent;
              console.error("Gallery data fetch error:", customEvent.detail.error);
              setError(customEvent.detail.error || "Failed to fetch gallery data.");
              setLoading(false);
              window.removeEventListener('gallery-data-loaded', successHandler);
              window.removeEventListener('gallery-data-error', errorHandler);
              document.body.removeChild(script);
              resolve(null);
            }) as EventListener;
            
            window.addEventListener('gallery-data-loaded', successHandler);
            window.addEventListener('gallery-data-error', errorHandler);
            
            document.body.appendChild(script);
          });
        };
        
        const data = await fetchData() as GalleryData[] | null;
        if (!data) return;
        
        const processedData = data
          .map((gallery) => {
            const cover = gallery.images.find((img) => img.is_cover_photo);
            if (cover && !gallery.cover_image_id) {
              gallery.cover_image_id = cover.id;
            }
            if (!gallery.images || gallery.images.length === 0) {
              console.warn(`Gallery "${gallery.title}" has no images, filtering out.`);
              return null;
            }
            return gallery;
          })
          .filter(Boolean) as GalleryData[];

        setGalleries(processedData);
        setCurrentIndex(0);

        if (processedData.length > 0) {
          const firstCover = processedData[0].images.find(img =>
            img.is_cover_photo || (processedData[0].cover_image_id && img.id === processedData[0].cover_image_id)
          ) || processedData[0].images[0];
          if (firstCover) {
            setCurrentLocation(firstCover.location || processedData[0].title || "Unknown Location");
          } else {
            setCurrentLocation(processedData[0].title || "Unknown Location");
          }
        } else {
          setCurrentLocation("No Galleries Available");
        }
        
      } else {
        // Partytown yoksa normal fetch kullanılır
        const response = await fetch("/api/gallery");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data: GalleryData[] = await response.json();

        data = data
          .map((gallery) => {
            const cover = gallery.images.find((img) => img.is_cover_photo);
            if (cover && !gallery.cover_image_id) {
              gallery.cover_image_id = cover.id;
            }
            if (!gallery.images || gallery.images.length === 0) {
              console.warn(`Gallery "${gallery.title}" has no images, filtering out.`);
              return null;
            }
            return gallery;
          })
          .filter(Boolean) as GalleryData[];

        setGalleries(data);
        setCurrentIndex(0);

        if (data.length > 0) {
          const firstCover = data[0].images.find(img =>
            img.is_cover_photo || (data[0].cover_image_id && img.id === data[0].cover_image_id)
          ) || data[0].images[0];
          if (firstCover) {
            setCurrentLocation(firstCover.location || data[0].title || "Unknown Location");
          } else {
            setCurrentLocation(data[0].title || "Unknown Location");
          }
        } else {
          setCurrentLocation("No Galleries Available");
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch gallery data.");
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  const handlePrevious = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleImageClick = (galleryIndex: number) => {
    if (galleryIndex >= 0 && galleryIndex < galleries.length) {
      setSelectedGallery(galleries[galleryIndex]);
      setModalImageIndex(0);
      setIsModalOpen(true);
    } else {
      console.warn("Clicked on an invalid slide index:", galleryIndex);
    }
  };

  const coverImages = galleries
    .map((gallery, index) => {
      const coverImage =
        gallery.images.find(
          (img) =>
            img.is_cover_photo ||
            (gallery.cover_image_id && img.id === gallery.cover_image_id)
        ) || (gallery.images.length > 0 ? gallery.images[0] : null);

      return coverImage ? { ...coverImage, originalGalleryIndex: index } : null;
    })
    .filter(Boolean) as (GalleryImage & { originalGalleryIndex: number })[];

  const displayGalleryIndex = currentIndex < galleries.length ? currentIndex : -1;
  const currentGalleryForDisplay = displayGalleryIndex !== -1 ? galleries[displayGalleryIndex] : null;

  if (loading) {
    return (
      <section id="gallery">
        <GallerySkeleton />
      </section>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  }

  if (!galleries || galleries.length === 0) {
    return (
      <section id="gallery" className="py-10 text-center text-neutral-500">
        No galleries found.
      </section>
    );
  }

  const isNextDisabled = currentIndex === coverImages.length - 1 || coverImages.length === 0;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="w-full ml-0 md:ml-8 lg:ml-16 mr-0 mt-12 md:mt-20 lg:mt-36 pl-4 sm:pl-6 lg:pl-8 overflow-hidden relative"
    >
      <motion.div
        className="flex flex-col lg:flex-row lg:gap-10"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          className="w-full lg:w-[37%] mb-8 lg:mb-0 flex-shrink-0"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
            },
          }}
        >
          <div className="flex flex-col w-full text-neutral-500 h-full justify-start">
            <div>
              <h2 className="text-center lg:text-left text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-tight text-neutral-800 font-manrope font-bold">
                Gallery
              </h2>
              <p className="mt-4 md:mt-8 text-xl sm:text-2xl lg:text-3xl leading-relaxed text-center lg:text-left max-w-xl">
                Explore our curated collections of moments and memories.
              </p>
            </div>

            <div className="mt-8 lg:mt-12">
              <div className="relative h-20 flex items-center justify-center lg:justify-start mb-8">
                <button
                  onClick={handlePrevious}
                  className="flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-x-1 p-2"
                  aria-label="Previous Gallery"
                  disabled={currentIndex === 0}
                >
                  <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M28 20H12" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M18 14L12 20L18 26" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className="text-2xl sm:text-3xl lg:text-4xl tracking-tighter leading-snug text-center w-[30vw] md:w-[15vw]">
                  {currentGalleryForDisplay ? (
                    <>
                      {currentGalleryForDisplay.title}
                    </>
                  ) : (
                    <>
                      <br />
                      <span className="font-bold text-neutral-800"> </span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:translate-x-1 p-2"
                  aria-label="Next Gallery"
                  disabled={isNextDisabled}
                >
                  <svg width="50" height="50" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-16 sm:h-16">
                    <path d="M12 20H28" stroke="black" strokeWidth="3" strokeLinecap="round" />
                    <path d="M22 14L28 20L22 26" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl tracking-tighter leading-snug text-center lg:text-left pr-4 max-w-2xl">
                {currentGalleryForDisplay ? (
                  <>
                    <span className="font-bold text-neutral-800 mt-2 block">
                      {currentGalleryForDisplay.description}
                    </span>
                  </>
                ) : (
                  <>
                    <br />
                    <span className="font-bold text-neutral-800"> </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={slideRef}
          className="items-end w-full lg:w-[68%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-auto"
          variants={{
            hidden: { opacity: 0, x: 500 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            },
          }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              const newIndex = swiper.realIndex ?? swiper.activeIndex;
              setCurrentIndex(newIndex);

              if (newIndex >= 0 && newIndex < coverImages.length) {
                const currentCover = coverImages[newIndex];
                const currentGallery = galleries[currentCover.originalGalleryIndex];
                setCurrentLocation(currentCover.location || currentGallery?.title || "Unknown Location");
              } else {
              }
            }}
            modules={[EffectMaterial]}
            effect="material"
            grabCursor={true}
            speed={850}
            spaceBetween={16}
            slidesPerView={1.5}
            loop={false}
            centeredSlides={true}
            initialSlide={0}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 16,
                centeredSlides: true,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
                centeredSlides: false,
              },
            }}
            className="h-full w-full material-swiper"
          >
            {coverImages.map((image, index) => (
              <SwiperSlide key={image.id || `gallery-cover-${index}`}>
                <div className="swiper-material-wrapper">
                  <div className="swiper-material-content">
                    <div
                      className="relative w-full h-full aspect-[19/20] rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => handleImageClick(image.originalGalleryIndex)}
                      style={{ position: 'relative' }} /* Ensure position is explicitly set for Image with fill prop */
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.title || galleries[image.originalGalleryIndex]?.title || "Gallery cover image"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 30vw"
                        priority={index < 3}
                        className="demo-material-image group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                      <span
                        className="absolute top-4 left-4 backdrop-blur-sm bg-white/30 text-white py-2 px-4 rounded-full text-sm sm:text-base swiper-material-animate-opacity font-jakarta font-normal z-10"
                      >
                        {image.location || galleries[image.originalGalleryIndex]?.title || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {isLargeScreen && (
              <SwiperSlide key="blank-slide-end" className="pointer-events-none">
                <div className="swiper-material-wrapper">
                  <div className="swiper-material-content">
                    <div className="relative w-full h-full aspect-[19/20] rounded-2xl overflow-hidden bg-transparent flex items-center justify-center">
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )}

          </Swiper>
        </motion.div>
      </motion.div>

      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gallery={selectedGallery}
        currentImageIndex={modalImageIndex}
        onPrevImage={() =>
          setModalImageIndex((prev) =>
            prev > 0
              ? prev - 1
              : (selectedGallery?.images.length || 1) - 1
          )
        }
        onNextImage={() =>
          setModalImageIndex((prev) =>
            prev < (selectedGallery?.images.length || 1) - 1 ? prev + 1 : 0
          )
        }
      />
    </section>
  );
};

const GallerySkeleton: React.FC = () => {
  return (
    <section
      id="gallery-skeleton"
      className="w-full ml-0 md:ml-8 lg:ml-16 mr-0 mt-12 md:mt-20 lg:mt-36 pl-4 sm:pl-6 lg:pl-8 overflow-hidden relative"
      aria-hidden="true"
    >
      <div className="flex flex-col lg:flex-row lg:gap-10">
        <div className="w-full lg:w-[37%] mb-8 lg:mb-0 flex-shrink-0">
          <div className="flex flex-col w-full h-full justify-start gap-8 lg:gap-16">
            <div className="space-y-4">
              <div className="h-8 sm:h-10 lg:h-12 bg-neutral-200 rounded-lg w-3/4 lg:w-1/2 mx-auto lg:mx-0 animate-pulse"></div>
              <div className="h-5 sm:h-7 lg:h-9 bg-neutral-200 rounded-lg w-full lg:w-5/6 mx-auto lg:mx-0 animate-pulse"></div>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-8">
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-neutral-200 rounded-full animate-pulse transition-opacity duration-300"></div>
              <div className="h-8 w-24 bg-neutral-200 rounded-lg animate-pulse transition-opacity duration-300"></div>
              <div className="h-14 w-14 sm:h-16 sm:w-16 bg-neutral-200 rounded-full animate-pulse transition-opacity duration-300"></div>
            </div>
            <div className="space-y-3">
              <div className="h-7 sm:h-9 lg:h-11 bg-neutral-200 rounded-lg w-1/2 lg:w-1/3 mx-auto lg:mx-0 animate-pulse"></div>
              <div className="h-5 sm:h-7 lg:h-9 bg-neutral-200 rounded-lg w-3/4 lg:w-2/3 mx-auto lg:mx-0 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[68%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[550px] flex gap-4">
          <div className="flex-1 h-full relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-neutral-200 animate-pulse"></div>
            <div className="absolute bottom-4 left-4 h-8 w-24 bg-neutral-300 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 h-full relative overflow-hidden rounded-2xl hidden sm:block animate-pulse-delay-100">
            <div className="absolute inset-0 bg-neutral-200"></div>
            <div className="absolute bottom-4 left-4 h-8 w-24 bg-neutral-300 rounded-full"></div>
          </div>
          <div className="flex-1 h-full relative overflow-hidden rounded-2xl hidden lg:block animate-pulse-delay-200">
            <div className="absolute inset-0 bg-neutral-200"></div>
            <div className="absolute bottom-4 left-4 h-8 w-24 bg-neutral-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <div 
        className="h-2 bg-green-600/30 rounded-full absolute bottom-0 left-0 right-0 mx-auto w-full max-w-[250px]"
        style={{
          animation: 'loading 1.5s ease-in-out infinite',
        }}
      ></div>
      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0;
            opacity: 0.5;
          }
          50% {
            width: 100%;
            opacity: 1;
          }
          100% {
            width: 0;
            opacity: 0.5;
          }
        }
        .animate-pulse-delay-100 {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 100ms;
        }
        .animate-pulse-delay-200 {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 200ms;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .7;
          }
        }
      `}</style>
    </section>
  )
}

export default Gallery;