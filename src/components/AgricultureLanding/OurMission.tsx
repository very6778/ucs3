"use client"
import type * as React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const OurMission: React.FC = () => {
  const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

  const cdnAboutUrl = `${NEXT_PUBLIC_CDN_URL}/about.webp`;
  const localAboutUrl = '/about.webp';
  const [aboutImageSrc, setAboutImageSrc] = useState(cdnAboutUrl);

  const handleAboutImageError = () => {
    if (aboutImageSrc === cdnAboutUrl) {
      setAboutImageSrc(localAboutUrl);
    }
  };

  return (
    <motion.section
      className="overflow-hidden px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 pb-8 md:pb-16 bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.article
        className="flex flex-col px-4 sm:px-8 md:px-16 pt-6 md:pt-10 pb-10 md:pb-20 mt-10 md:mt-24 text-lime-700 bg-lime-50 rounded-[20px] md:rounded-[44px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.h2
          className="self-center text-center text-3xl sm:text-4xl md:text-5xl font-light leading-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Our Mission
        </motion.h2>
        <motion.h3
          className="mt-2 md:mt-3.5 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-center leading-[1.2] md:leading-[1.3] lg:leading-[128px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Making agriculture easier
        </motion.h3>
      </motion.article>

      <div className="mt-8 md:mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-full w-full">
            <motion.figure
              className="flex relative flex-col h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.2] md:leading-[1.3] lg:leading-[64px] rounded-[20px] md:rounded-[44px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Image
                src={aboutImageSrc}
                alt="Agricultural inspiration"
                fill
                className="object-cover rounded-[20px] md:rounded-[44px]"
                onError={handleAboutImageError}
                unoptimized
              />
              <div className="absolute inset-0 bg-black opacity-15 rounded-[20px] md:rounded-[44px]" />
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white text-center">
                  "He who plants a seed plants hope."
                </p>
              </div>
            </motion.figure>
          </div>

          <div className="h-full w-full">
            <motion.article
              className="flex flex-col h-[350px] sm:h-[400px] md:h-[450px] lg:h-[550px] w-full py-8 md:py-16 px-6 sm:px-8 md:px-8 text-white bg-green-950 rounded-[20px] md:rounded-[44px] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <h3 className="self-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
                For better
                <br />
                tomorrows
              </h3>
              <p className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-snug md:leading-relaxed overflow-y-auto">
                Lorem ipsum dolor sit amet, aliqua consectetur adipiscing elit, sed do eiusmod tempor incididunt tempor
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud aliqua ullamco Ut enim ad mini magna
              </p>
            </motion.article>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default OurMission