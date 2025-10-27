"use client"
import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import ExpandingProductImage from "./ExpandingProductImage"

interface ImageComponentProps {
  src: string;
  className: string;
  alt?: string;
  delay?: number;
  skipLoading?: boolean;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, className, alt = "Image", skipLoading = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isLoading, setIsLoading] = useState(true);
  const rawCdnBase = process.env.NEXT_PUBLIC_CDN_URL || "";
  const normalizedCdnBase = rawCdnBase.endsWith("/") ? rawCdnBase.slice(0, -1) : rawCdnBase;
  const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);
  const resolvedSrc = normalizedCdnBase ? `${normalizedCdnBase}${normalizePath(src)}` : normalizePath(src);
  const fallbackSrc = normalizePath(src);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc || fallbackSrc);
  }, [resolvedSrc, fallbackSrc]);

  const handleImageLoaded = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && !skipLoading && (
        <motion.div
          className={`absolute inset-0 ${className}`}
          style={{
            width: "auto",
            height: "50vh",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
          </div>
        </motion.div>
      )}
      <motion.img
        ref={ref}
        className={`object-cover ${className}`}
        style={{
          width: "auto",
          height: "50vh",
          boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px 5px rgba(0, 0, 0, 0.2)",
        }}
        src={currentSrc}
        alt={alt}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
        onLoad={handleImageLoaded}
        onError={() => {
          if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
          }
        }}
      />
    </div>
  );
};

const OurProducts: React.FC = () => {
  const sectionRef = useRef(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const videoAspectRatio = 1.43
  const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`)
  const productData = [
    {
      id: 1,
      imageUrl: "/cimento.webp",
      title: "Cement",
      content:
        "High-strength cement optimized for structural durability and consistent onsite performance in modern building projects.",
    },
    {
      id: 2,
      imageUrl: "/demir.jpeg",
      title: "Structural Steel",
      content:
        "Premium grade rebar and profiles providing reliable load-bearing support across residential and industrial constructions.",
    },
    {
      id: 3,
      imageUrl: "/kablo.jpg",
      title: "Industrial Cabling",
      content:
        "Durable power and data cabling designed for heavy-duty installations with superior insulation and safety compliance.",
    },
    {
      id: 4,
      imageUrl: "/mermer.jpg",
      title: "Marble Surfaces",
      content:
        "Premium marble slabs delivering refined aesthetics and longevity for interior cladding, flooring, and architectural details.",
    },
  ]
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }
  const imageHeight = Math.floor(300 / videoAspectRatio)
  useEffect(() => {
    if (carouselRef.current) {
      const element = carouselRef.current
      const videoElementIndex = 2
      const elementWidth = 300 + 16
      const centerPosition = videoElementIndex * elementWidth - element.offsetWidth / 2 + elementWidth / 2
      element.scrollTo({
        left: centerPosition,
        behavior: "smooth",
      })
    }
  }, [])
  return (
    <motion.div
      id="products"
       ref={sectionRef}
       className="flex flex-col items-center justify-center pb-20 rounded-none max-md:pb-24 mt-0 scroll-mt-[15px]"
      style={{ zoom: "100%" }}
    >
      <div className="self-center mt-0 md:mt-10 w-full max-w-[1440px]">
        <div className="flex flex-col items-center mb-10 relative">
          <div
            className="absolute rounded-full bg-green-100 opacity-20 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw]"
            style={{
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(138, 179, 25, 0.76) 0%, rgba(255, 255, 255, 0) 70%)",
              zIndex: "1",
            }}
          />
          <motion.h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-neutral-800 text-center mt-0 md:mt-0 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={textVariants}
          >
            <span className="font-normal">Our</span> Products
          </motion.h2>
          <motion.div
            className="text-2xl leading-7 text-center md:max-w-[40vw] lg:max-w-[60vw] mt-0 text-neutral-400"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={textVariants}
          >
            Explore a curated mix of agricultural and construction essentials—engineered for
            <span className="text-neutral-800 font-semibold"> performance, sustainability </span>
            and dependable supply across both sectors.
          </motion.div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 ">
          <div className="flex flex-col md:w-9/12">
            <div className="flex flex-col">
              <div className="relative flex flex-col items-center md:hidden">
                <div className="mt-6 w-full overflow-hidden no-scrollbar" ref={carouselRef}>
                  <div className="flex space-x-4 px-4 pb-4 snap-x snap-mandatory scroll-smooth overflow-x-auto no-scrollbar">
                    {productData.slice(0, 2).map((product, index) => (
                      <div className="snap-center shrink-0" key={product.id}>
                        <div style={{ width: "300px", height: `${imageHeight}px` }}>
                          <ExpandingProductImage imageData={product} className="relative w-full h-full" />
                        </div>
                      </div>
                    ))}
                    <div className="snap-center shrink-0">
                      <div className="w-[300px] relative" style={{ height: `${imageHeight}px` }}>
                        <img
                          className="w-full h-full object-cover rounded-xl"
                          src={normalizePath("/2.jpg")}
                          alt="Products display"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/2.jpg";
                          }}
                        />
                      </div>
                    </div>
                    {productData.slice(2).map((product, index) => (
                      <div className="snap-center shrink-0" key={product.id}>
                        <div style={{ width: "300px", height: `${imageHeight}px` }}>
                          <ExpandingProductImage imageData={product} className="relative w-full h-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-center mt-4 space-x-2 md:hidden">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300"></div>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex md:flex-row">
                <div className="flex flex-col md:w-[24%] items-center"></div>
              </div>
              <div className="self-center mt-4 max-w-full">
                <div className="hidden md:flex md:flex-row gap-5">
                  <div className="flex flex-col md:w-[31%] items-center">
                    <div className="relative w-[15vw] h-[15vw]">
                      <ExpandingProductImage
                        imageData={productData[0]}
                        className="max-w-full relative w-full h-full top-14"
                      />
                    </div>
                    <div className="self-end top-28 relative w-[10vw] h-[10vw]">
                      <ExpandingProductImage
                        imageData={productData[1]}
                        className="max-w-full relative w-full h-full top-14"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:w-[69%] items-center justify-center">
                    <ImageComponent
                      src="/our-main.webp"
                      className="grow mt-9 rounded-[250px] max-md:mt-10"
                      delay={0.4}
                      skipLoading={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:flex  md:flex-col md:w-3/12 items-center">
            <div className="flex flex-col w-full">
              <div className="flex flex-col md:pr-10">
                <div className="flex items-start self-start">
                  <div className="shrink-0 self-end mt-3 relative w-[10vw] h-[10vw] max-md:mr-0">
                    <ExpandingProductImage imageData={productData[2]} className="max-w-full relative w-full h-full" />
                  </div>
                </div>
                <div className="self-end mt-10 relative w-[15vw] h-[15vw] max-md:mt-10">
                  <ExpandingProductImage
                    imageData={productData[3]}
                    className="max-w-full relative w-full h-full top-14"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mt-32 md:mt-64 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="w-full bg-lime-50 rounded-[30px] overflow-hidden shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center py-6 px-12 md:px-16">
              <div className="text-center md:text-left md:flex md:justify-start md:items-center md:w-[320px]">
                <h2 className="text-4xl md:text-5xl font-extrabold" style={{ color: "#5FA612" }}>
                  Sustainability
                </h2>
              </div>
              <div
                className="hidden md:block w-[2px] h-16 self-center mx-12"
                style={{ backgroundColor: "rgba(166, 203, 126, 0.16)" }}
              />
              <p
                className="text-xl md:text-2xl font-semibold leading-relaxed mt-4 md:mt-0 text-center md:text-left flex-1"
                style={{ color: "#5FA612" }}
              >
                Preserving nature while delivering premium quality products for a sustainable future
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default OurProducts