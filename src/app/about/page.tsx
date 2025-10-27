"use client"
import type * as React from "react"
import AboutUs from "@/components/AgricultureLanding/AboutUs"
import Header from "@/components/AgricultureLanding/Header"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Settings, Grid, Contact } from "lucide-react"
import Lenis from "@studio-freight/lenis"
// Documents section removed

const navItems = [
  {
    icon: Settings,
    label: "Home",
    hasDropdown: false,
  },
  {
    icon: Settings,
    label: "Services",
    hasDropdown: true,
  },
  {
    icon: Settings,
    label: "About",
    hasDropdown: false,
  },
  {
    icon: Grid,
    label: "Gallery",
    hasDropdown: false,
  },
  {
    icon: Contact,
    label: "Contact",
    hasDropdown: false,
  },
]

const About: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"services" | "gallery" | null>(null)
  const navbarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const logoSrc = "/logo.webp"

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    // Lock body scroll on About page
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const navbarItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.4,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  const dropdownVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeInOut" } },
  }

  const handleNavClick = (label: string) => {
    console.log(`Clicked on ${label}`)
    if (activeDropdown) {
      setActiveDropdown(null)
      setActiveSection(null)
    }

    if (label === "Home") {
      window.location.href = "/"
    } else if (label === "About") {
      const aboutSection = document.getElementById("about")
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (label === "Gallery") {
      window.location.href = "/#gallery"
    } else if (label === "Contact") {
      window.location.href = "/#contact"
    }
  }

  const handleDropdownToggle = (label: string) => {
    if (label !== "Services") {
      handleNavClick(label)
      return
    }

    setActiveDropdown((prev) => (prev === label ? null : label))
    setActiveSection((prev) => (prev === "services" ? null : "services"))
  }

  const handleNavItemMouseLeave = (label: string) => {
    if (!isMobile && dropdownRef.current && !dropdownRef.current.matches(":hover")) {
      setActiveDropdown(null)
      setActiveSection(null)
    }
  }

  return (
    <main className="bg-gradient-to-b from-[#FEF4CF] via-[#FEF7DC] to-white pt-0 h-screen overflow-hidden">
      <div
        ref={navbarRef}
        className="flex flex-col md:flex-row md:justify-between md:items-center px-4 md:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          className="relative z-[100] flex justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0 cursor-pointer"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          onClick={() => (window.location.href = "/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <picture>
            <img
              className="w-[180px] md:w-[220px] lg:w-[250px] h-auto"
              src={logoSrc}
              alt="UCS GROUP logo"
              loading="eager"
            />
          </picture>
        </motion.div>

        <motion.nav
          className="flex flex-wrap justify-center md:justify-end gap-2.5 text-sm md:text-base font-medium whitespace-nowrap text-zinc-600"
          style={{ zIndex: 100 }}
        >
          {navItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div key={index} custom={index} variants={navbarItemVariants} initial="hidden" animate="visible">
                <motion.button
                  ref={(el) => {
                    if (el) {
                      navItemRefs.current[index] = el
                    }
                  }}
                  onClick={() => (item.hasDropdown ? handleDropdownToggle(item.label) : handleNavClick(item.label))}
                  onMouseEnter={() => item.hasDropdown && handleDropdownToggle(item.label)}
                  onMouseLeave={() => item.hasDropdown && handleNavItemMouseLeave(item.label)}
                  className={`flex items-center gap-1.5 px-4 py-2 tracking-tighter rounded-[50px] transition-colors cursor-pointer font-poppins
                      ${activeSection === item.label.toLowerCase() ? "" : ""}`}
                  variants={navbarItemVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.8, ease: "easeInOut" }}
                  >
                    <Icon className="hidden" />
                  </motion.div>
                  <motion.div
                    className="text-zinc-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 1 }}
                  >
                    {item.label}
                  </motion.div>
                  {item.hasDropdown && (
                    <motion.div
                      animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-[14px] h-[14px] stroke-zinc-600 ml-1" />
                    </motion.div>
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </motion.nav>
      </div>
      {!isMobile && (
        <AnimatePresence>
          {activeDropdown && (
            <>
              <motion.div
                className="fixed top-0 left-0 w-full h-full bg-black/20 backdrop-blur-md z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }}
                exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }}
                onClick={() => {
                  setActiveDropdown(null)
                  setActiveSection(null)
                }}
              />

              <motion.div
                ref={dropdownRef}
                className="absolute left-0 w-screen bg-white z-50 top-0"
                onMouseLeave={() => {
                  setActiveDropdown(null)
                  setActiveSection(null)
                }}
                variants={dropdownVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Header activeSection={activeSection || "gallery"} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
      {isMobile && (
        <AnimatePresence>
          {activeDropdown && (
            <motion.div
              ref={dropdownRef}
              className="w-full bg-white z-50 mt-0 pt-0 shadow-lg rounded-md overflow-hidden"
              variants={dropdownVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Header activeSection={activeSection || "gallery"} margintop="pt-0 mt-0" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AboutUs />
    </main>
  )
}

export default About