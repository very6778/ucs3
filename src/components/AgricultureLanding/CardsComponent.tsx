"use client"

import type React from "react"

import Image from "next/image"
import { useTransform, motion, useScroll, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Lenis from "@studio-freight/lenis"

interface Project {
  title: string
  description: string
  image: string
}

interface CardProps extends Project {
  i: number
  progress: any
  range: [number, number]
  targetScale: number
}

const projects = [
    {
    title: "Research and Development",
    image: "/11.webp",
    description:
      "Innovation-Driven Growth, Quality-Focused Solutions\n\nOur commitment to research and development is at the core of our strategy for long-term success. By continuously analyzing global market trends, agricultural technologies, and product performance, we develop data-driven solutions tailored to evolving customer needs.\nFrom improving grain quality standards to identifying new sourcing regions, our R&D efforts enable us to stay ahead of the curve—delivering measurable value, reducing risk, and strengthening supply chain resilience.",
  },
  {
    title: "Grain Services",
    image: "/13.webp",
    description:
      "With our extensive experience in international agricultural trade, we add value to the industry through a diverse product portfolio that includes high-protein wheat, barley, corn, and soybeans. Our consistent supply capability, strong network of trusted producers, and product-focused service approach enable us to deliver sustainable and competitive solutions to our clients.",
  },
  {
    title: "Logistic Advantages",
    image: "/12.webp",
    description:
      "Right Product, Right Time, Right Destination\n\nThrough strong connections at Novorossiysk, Mersin, and Iskenderun ports, we ensure fast and flexible maritime transport. Additionally, with our proven capability in land logistics, we offer factory-delivered solutions (DAP/DDP) directly to your doorstep.\nAt every stage of the supply chain, we provide our partners with superior logistical advantages through traceability, efficient planning, and a customer-focused approach—saving both time and cost.",
  },
];

const Card: React.FC<CardProps> = ({ i, title, description, progress, range, targetScale, image }) => {
  const container = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.35, 1])
  const scale = useTransform(progress, range, [1, targetScale])

  const isInView = useInView(container, { once: false, amount: 0.1 })

  const cardContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "linear",
      },
    },
  }

  const staticGradient =
    i === 0
      ? 'linear-gradient(135deg, hsl(45, 100%, 75%) 0%, hsl(47, 100%, 65%) 25%, hsl(40, 95%, 60%) 50%, hsl(43, 90%, 65%) 75%, hsl(45, 100%, 75%) 100%)'
      : i === 1
        ? 'linear-gradient(150deg, hsl(39, 95%, 65%) 0%, hsl(37, 90%, 55%) 25%, hsl(35, 85%, 50%) 40%, hsl(38, 90%, 60%) 75%, hsl(39, 95%, 65%) 100%)'
        : 'linear-gradient(165deg, hsl(36, 90%, 60%) 0%, hsl(34, 85%, 50%) 30%, hsl(32, 80%, 45%) 60%, hsl(35, 85%, 55%) 85%, hsl(36, 90%, 60%) 100%)'

  const hoverGlow = "0 0 30px 5px rgba(255, 230, 150, 0.3)"

  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL;
  const localImageUrl = image || "/placeholder.svg";

  const [currentImageUrl, setCurrentImageUrl] = useState(cdnUrl ? `${cdnUrl}${localImageUrl}` : localImageUrl);

  const handleImageError = () => {
    if (currentImageUrl.startsWith(cdnUrl || '')) {
      setCurrentImageUrl(localImageUrl);
    }
  };

  // Create an array of paragraphs from description
  const descriptionParagraphs = description.split('\n\n');

  return (
    <div ref={container} className="md:mt-72 mt-32 min-h-screen sticky top-[15vh] px-2 sm:px-3 md:px-4 z-10">
      <div
        style={{
          top: `calc(-5vh + ${i * 60}px)`,
          position: "relative",
          zIndex: projects.length - i,
        }}
      >
        <motion.div
          style={{
            background: staticGradient,
            scale,
            boxShadow: "0 10px 30px rgba(150, 120, 40, 0.2)",
            backgroundBlendMode: "soft-light",
            backgroundSize: "200% 200%",
            willChange: "transform",
          }}
          whileHover={
            isMounted
              ? {
                boxShadow: hoverGlow,
                y: -5,
                transition: { duration: 0.5 },
              }
              : undefined
          }
          className="flex flex-col relative w-full max-w-[95vw] h-[70vh] sm:h-[70vh] rounded-[25px] p-6 sm:p-[40px] sm:pb-[80px] origin-top overflow-hidden"
        >
          <div className="absolute w-[30%] h-[30%] rounded-full animate-pulse" style={{ top: "15%", right: "25%" }}></div>
          <div className="absolute w-[40%] h-[40%] rounded-full" style={{ bottom: "15%", right: "8%" }}></div>
          <div className="absolute w-[20%] h-[20%] rounded-full" style={{ top: "25%", left: "15%" }}></div>
          <div className="absolute w-[25%] h-[25%] rounded-full" style={{ bottom: "30%", left: "20%" }}></div>

          <motion.div
            className="flex flex-col h-full pt-12 sm:pt-14 relative z-10"
            variants={cardContentVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className="flex flex-col sm:flex-row h-full sm:gap-[50px]">
              {/* Text Content */}
              <div className="w-full sm:w-[50%] flex flex-col justify-start">
                {/* Tag */}
                <div className="border border-yellow-900 rounded-3xl border-solid px-4 py-2 inline-block w-fit mb-6">
                  <motion.p className="text-sm sm:text-base font-medium">Our Services</motion.p>
                </div>
                {/* Title */}
                <motion.h2 className="text-start m-0 font-extrabold text-4xl sm:text-5xl md:text-6xl mb-6">{title}</motion.h2>
                {/* Description - with overflow handling */}
                <div className="overflow-y-auto pr-2 max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] no-scrollbar">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <motion.p 
                      key={index} 
                      className={`text-xs sm:text-sm md:text-lg lg:text-xl font-medium text-neutral-800 ${index < descriptionParagraphs.length - 1 ? 'mb-4' : 'mb-0'}`}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full sm:w-[50%] h-[250px] sm:h-[90%] rounded-[25px] overflow-hidden mt-6 sm:mt-0 ml-auto">
                <motion.div className="w-full h-full" style={{ scale: imageScale }}>
                  <Image
                    fill
                    src={currentImageUrl}
                    alt={title}
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover"
                    onError={handleImageError}
                    unoptimized
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function Cards() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  return (
    <main ref={container} className="relative">
      {projects.map((project, i) => {
        const targetScale = 1 - (projects.length - i) * 0.05
        const startRange = i * 0.25
        const endRange = 1

        return (
          <Card
            key={`p_${i}`}
            i={i}
            {...project}
            progress={scrollYProgress}
            range={[startRange, endRange]}
            targetScale={targetScale}
          />
        )
      })}
    </main>
  )
}