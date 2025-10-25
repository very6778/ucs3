"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import GalleryModal from "./GalleryModal";
import type { LocalGallery, LocalGalleryImage } from "@/types/gallery";

import type SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "./styles.css";

import "swiper/css";
import "swiper/css/bundle";

interface GalleryProps {
  initialGalleries: LocalGallery[];
}

type CoverImageMeta = LocalGalleryImage & {
  galleryIndex: number;
  imageIndex: number;
};

const Gallery: React.FC<GalleryProps> = ({ initialGalleries }) => {
  const galleries = initialGalleries;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedGallery, setSelectedGallery] = useState<LocalGallery | null>(
    () => initialGalleries[0] ?? null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const controls = useAnimation();
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize, { passive: true });

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const handlePrevious = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleImageClick = (galleryIndex: number, imageIndex: number) => {
    const gallery = galleries[galleryIndex];
    if (!gallery) {
      console.warn("Clicked on an invalid slide index:", galleryIndex);
      return;
    }
    setSelectedGallery(gallery);
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const coverImages = useMemo<CoverImageMeta[]>(() => {
    return galleries.flatMap((gallery, galleryIndex) =>
      gallery.images.map((image, imageIndex) => ({
        ...image,
        galleryIndex,
        imageIndex,
      }))
    );
  }, [galleries]);

  const currentCoverMeta = coverImages[currentSlideIndex] ?? null;
  const shouldAutoplay = coverImages.length > 1;
  const currentGalleryForDisplay = currentCoverMeta
    ? galleries[currentCoverMeta.galleryIndex]
    : null;

  if (!galleries || galleries.length === 0) {
    return (
      <section id="gallery" className="py-10 text-center text-neutral-500">
        No galleries found.
      </section>
    );
  }

  const isNextDisabled =
    coverImages.length === 0 || (!shouldAutoplay && currentSlideIndex === coverImages.length - 1);

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
                  disabled={!shouldAutoplay && currentSlideIndex === 0}
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
          className="items-end w-full lg:w-[65%] lg:-ml-6 xl:-ml-10 h-[400px] sm:h-[500px] md:h-[600px] lg:h-auto"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
            },
          }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              if (shouldAutoplay) {
                swiper.autoplay?.start();
              }
            }}
            onSlideChange={(swiper) => {
              const newIndex = swiper.realIndex ?? swiper.activeIndex;
              setCurrentSlideIndex(newIndex % (coverImages.length || 1));

              if (newIndex >= 0 && coverImages.length > 0) {
                const currentCover = coverImages[newIndex % coverImages.length];
                const currentGallery = galleries[currentCover.galleryIndex];
                if (currentGallery) {
                  setSelectedGallery(currentGallery);
                  setModalImageIndex(currentCover.imageIndex);
                }
              }
            }}
            modules={[Autoplay]}
            grabCursor={!shouldAutoplay}
            speed={shouldAutoplay ? 4500 : 850}
            spaceBetween={16}
            slidesPerView={1.5}
            loop={shouldAutoplay}
            allowTouchMove={!shouldAutoplay}
            autoplay={shouldAutoplay
              ? {
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }
              : undefined}
            centeredSlides={shouldAutoplay ? false : true}
            loopAdditionalSlides={shouldAutoplay ? coverImages.length : 0}
            initialSlide={0}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 16,
                centeredSlides: shouldAutoplay ? false : true,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 16,
                centeredSlides: false,
              },
            }}
            className="h-full w-full material-swiper auto-gallery-swiper"
          >
            {coverImages.map((image, index) => (
              <SwiperSlide key={`${image.galleryIndex}-${image.imageIndex}`}>
                <div className="swiper-material-wrapper">
                  <div className="swiper-material-content">
                    <div
                      className="relative w-full h-full aspect-[19/20] rounded-2xl overflow-hidden group cursor-pointer"
                      onClick={() => handleImageClick(image.galleryIndex, image.imageIndex)}
                      style={{ position: 'relative' }} /* Ensure position is explicitly set for Image with fill prop */
                    >
                      <Image
                        src={image.url || "/placeholder.svg"}
                        alt={image.title || "Gallery cover image"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 30vw"
                        priority={index < 3}
                        className="demo-material-image group-hover:scale-105 transition-transform duration-300 ease-in-out"
                        quality={90}
                      />
                      
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {isLargeScreen && coverImages.length > 0 && (
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

export default Gallery;