"use client"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface ImageData {
  id: number;
  imageUrl: string;
  title: string;
  content: string;
}

interface ExpandingProductImageProps {
  imageData: ImageData;
  className: string;
}

const ExpandingProductImage: React.FC<ExpandingProductImageProps> = ({ imageData, className }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [displayShadows, setDisplayShadows] = useState(true);
  const [actualShadows, setActualShadows] = useState(true);

  const containerRef = useRef(null);

  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.2
  });

  const cdnImageUrl = `${process.env.NEXT_PUBLIC_CDN_URL}${imageData.imageUrl}`;
  const localImageUrl = imageData.imageUrl;
  const [mainImageSrc, setMainImageSrc] = useState(cdnImageUrl);

  const handleMainImageError = () => {
    if (mainImageSrc === cdnImageUrl) {
      setMainImageSrc(localImageUrl);
    }
  };

  const cdnModalImageUrl = `${process.env.NEXT_PUBLIC_CDN_URL}${imageData.imageUrl}`;
  const localModalImageUrl = imageData.imageUrl;
  const [modalImageSrc, setModalImageSrc] = useState(cdnModalImageUrl);

  const handleModalImageError = () => {
    if (modalImageSrc === cdnModalImageUrl) {
      setModalImageSrc(localModalImageUrl);
    }
  };


  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setDisplayShadows(false);
        setActualShadows(false);
      } else {
        setDisplayShadows(true);
      }
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;
    if (displayShadows === false) {
      setActualShadows(false);
    } else {
      timerId = setTimeout(() => {
        setActualShadows(true);
      }, 170);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [displayShadows]);

  const handleClick = () => {
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedCard(null);
    if (!isMobile) {
      setDisplayShadows(true);
    }
  };

  const imageStyle = (!isMobile && actualShadows)
    ? { filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))" }
    : {};

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  const renderModalContent = () => (
    <>
      <motion.div
        key={`backdrop-${imageData.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-10"
        onClick={handleClose}
        transition={{ duration: 0.2, ease: "linear" }}
      />
      <div className="fixed inset-0 z-20 flex items-centerjustify-center p-4">
        {isMobile ? (
          <motion.div
            key={`modal-card-mobile-${imageData.id}`}
            className="bg-white rounded-xl max-w-2xl w-full mx-auto overflow-hidden"
            style={{ borderRadius: "5px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {renderModalInnerContent()}
          </motion.div>
        ) : (
          <motion.div
            key={`modal-card-desktop-${imageData.id}`}
            layoutId={`card-container-${imageData.id}`}
            className="bg-white rounded-xl max-w-2xl w-full mx-auto overflow-hidden"
            style={{ borderRadius: "5px" }}
          >
            {renderModalInnerContent()}
          </motion.div>
        )}
      </div>
    </>
  );

  const renderModalInnerContent = () => (
    <>
      {isMobile ? (
        <div className="w-full aspect-video relative">
          <Image
            src={modalImageSrc}
            alt={imageData.title}
            fill
            sizes="(max-width: 640px) 100vw, 800px"
            priority
            className="object-cover"
            onError={handleModalImageError}
            unoptimized
          />
        </div>
      ) : (
        <motion.div
          className="w-full aspect-video relative"
          layoutId={`card-image-container-${imageData.id}`}
        >
          <Image
            src={modalImageSrc}
            alt={imageData.title}
            fill
            sizes="(max-width: 640px) 100vw, 800px"
            priority
            className="object-cover"
            onError={handleModalImageError}
            unoptimized
          />
        </motion.div>
      )}
      <motion.div
        className="p-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {imageData.title}
        </h2>
        <div className="text-gray-600">
          <p>{imageData.content}</p>
        </div>
        <motion.button
          className="absolute top-4 right-4 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.1 }}
        >
          <X className="h-5 w-5 text-gray-700" />
        </motion.button>
      </motion.div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`cursor-pointer ${className}`}
          onClick={handleClick}
        >
          <motion.div
            className="w-full h-full"
            variants={imageVariants}
          >
            <div className="relative w-full h-full">
              <Image
                src={mainImageSrc}
                alt={imageData.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                priority
                className="object-cover rounded-lg"
                onError={handleMainImageError}
                unoptimized
              />
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          layoutId={`card-container-${imageData.id}`}
          className={`cursor-pointer ${className}`}
          onClick={handleClick}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="w-full h-full"
            layoutId={`card-image-container-${imageData.id}`}
            variants={imageVariants}
          >
            <div className="relative w-full h-full">
              <Image
                src={mainImageSrc}
                alt={imageData.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                className="object-cover rounded-full"
                style={imageStyle}
                onError={handleMainImageError}
                unoptimized
              />
            </div>
          </motion.div>
        </motion.div>
      )}
      <AnimatePresence>
        {selectedCard === imageData.id && renderModalContent()}
      </AnimatePresence>
    </>
  );
};

export default ExpandingProductImage;
