"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function MouseScrollIndicator() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isPageAvailable, setIsPageAvailable] = useState(false)

  useEffect(() => {
  if (typeof window !== "undefined") {
    const isDesktop = window.innerWidth >= 1024
    const isHome = window.location.pathname === "/"
    setIsPageAvailable(isDesktop && isHome)

    const handleScroll = () => {
      setHasScrolled(true)
      setIsVisible(false)
    }

    const visibilityTimeout = setTimeout(() => {
      if (window.scrollY === 0 && !hasScrolled) {
        setIsVisible(true)
      }
    }, 5000)

    const scrollListenerTimeout = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { once: true, passive: true })
    }, 500)

    return () => {
      clearTimeout(visibilityTimeout)
      clearTimeout(scrollListenerTimeout)
      window.removeEventListener("scroll", handleScroll)
    }
  }
}, [hasScrolled])

  const mouseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const dotVariants = {
    initial: { bottom: "80%", opacity: 0.8 },
    animate: {
      bottom: ["80%", "20%"],
      opacity: [0.8, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  if (hasScrolled || !isPageAvailable) return null

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      {isVisible && (
        <div className="flex flex-col items-center">
          <motion.div
            className="relative h-16 w-8 rounded-3xl border-2 border-[#D2D4DB]"
            variants={mouseVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="absolute left-1/2 h-1.5 w-1.5 rounded-full bg-[#99AAB5]"
              style={{ x: "-50%" }}
              variants={dotVariants}
              initial="initial"
              animate="animate"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
