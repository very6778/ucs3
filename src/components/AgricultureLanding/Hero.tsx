"use client"
import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronDown, Contact, Grid, Settings, Menu, X } from "lucide-react"
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion"
import Header from "./Header"
import { CharByCharText } from "../magicui/char-by-char"

interface CharByCharTextProps {
  text: string
  className?: string
  initialDelay?: number
  staggerDelay?: number
}

const StableCharByCharText: React.FC<CharByCharTextProps> = ({ text, className, initialDelay, staggerDelay }) => {
  return (
    <div style={{ position: "relative", minHeight: "1em" }}>
      <CharByCharText text={text} className={className} initialDelay={initialDelay} staggerDelay={staggerDelay} />
    </div>
  )
}

const criticalCSS = `
  .hero-section {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    padding-top: 3.5rem;
    margin-top: 1rem;
  }
  @media (min-width: 768px) {
    .hero-section {
      flex-direction: row;
      margin-bottom: 3rem;
    }
  }
  .hero-image-container {
    position: relative;
    width: 100%;
    height: 95vh;
    min-height: 600px;
    overflow: hidden;
    border-radius: 40px;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0);
    /* -webkit-mask-image: -webkit-radial-gradient(white, black); */ /* Removed to fix split loading appearance */
  }
  .hero-image {
    object-fit: cover;
    transition-property: opacity;
    transition-duration: 500ms;
  }
  .text-container {
    min-height: 240px; /* Reserve space for text animations */
  }
  @media (max-width: 768px) {
    .text-container {
      min-height: 10vh;
    }
  }
  .char-wrapper {
    display: inline-block;
    min-width: 0.5em; /* Minimum width for each character */
    opacity: 0;
  }
`

if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.setAttribute("type", "text/css")
  style.appendChild(document.createTextNode(criticalCSS))
  document.head.appendChild(style)
}

const heroImages = ["/hero1.webp", "/hero2.webp"]

interface NavItem {
  icon: React.ComponentType<any>
  label: string
  hasDropdown?: boolean
  isActive?: boolean
}

const navItems: NavItem[] = [
  {
    icon: Settings,
    label: "Services",
    isActive: false,
    hasDropdown: true,
  },
  {
    icon: Settings,
    label: "About",
    isActive: false,
    hasDropdown: false,
  },
  {
    icon: Grid,
    label: "Gallery",
    isActive: false,
    hasDropdown: false,
  },
  {
    icon: Contact,
    label: "Contact",
    isActive: false,
    hasDropdown: false,
  },
]

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<"services" | "gallery" | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const navbarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<React.MutableRefObject<(HTMLButtonElement | null)[]>>({ current: [] })
  const headingRef = useRef<HTMLDivElement>(null)
  const isHeadingInView = useInView(headingRef, { once: true, amount: 0.3 })
  const controls = useAnimation()
  const imageControls = useAnimation()
  const statsCardControls = useAnimation()
  const [cardVisible, setCardVisible] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sliderInterval = useRef<NodeJS.Timeout | null>(null)
  const savedNextImageCallbackRef = useRef<(() => void) | null>(null);

  const rawCdnBaseUrl = process.env.NEXT_PUBLIC_CDN_URL || "";
  const cdnBaseUrl = rawCdnBaseUrl.endsWith("/") ? rawCdnBaseUrl.slice(0, -1) : rawCdnBaseUrl;
  const toAssetPath = (path: string) => (path.startsWith("/") ? path : `/${path}`);
  const cdnOrLocal = (path: string) => {
    const normalizedPath = toAssetPath(path);
    return normalizedPath;
  };

  // State and handler for the logo images fallback
  const localLogoUrl = '/logo.webp';
  const logoImageSrc = localLogoUrl;

  // States and handlers for the hero slider images fallback
  const [heroSliderImageSources, setHeroSliderImageSources] = useState(
    heroImages.map(img => cdnOrLocal(img))
  );

  const handleHeroSliderImageError = (index: number) => {
    setHeroSliderImageSources(prevSources => {
      const newSources = [...prevSources];
      const localUrl = toAssetPath(heroImages[index]); 
      newSources[index] = localUrl;
      return newSources;
    });
  };


  useEffect(() => {
    if (isHeadingInView) {
      controls.start("visible")
      imageControls.start("visible")
    }
  }, [isHeadingInView, controls, imageControls])

  useEffect(() => {
    const animateCards = () => {
      if (isHeadingInView) {
        imageControls.start("visible")
        requestAnimationFrame(() => {
          setTimeout(() => {
            statsCardControls.start({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" } })
            setCardVisible(true)
          }, 500)
        })
      } else {
        statsCardControls.start({ opacity: 0, y: 20 })
        setCardVisible(false)
      }
    }
    animateCards()
  }, [isHeadingInView, imageControls, statsCardControls])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile, { passive: true })
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false)
    }
  }, [isMobile])

  const nextImage = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
  }, [isTransitioning, heroImages.length])

  useEffect(() => {
    savedNextImageCallbackRef.current = nextImage;
  }, [nextImage]);

  useEffect(() => {
    const tick = () => {
      savedNextImageCallbackRef.current?.();
    };
    
    // Set initial interval for the first image (3 seconds)
    sliderInterval.current = setInterval(tick, 3000)
    
    // Cleanup function
    return () => {
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current)
      }
    }
  }, [])
  
  // Update interval duration based on current image index
  useEffect(() => {
    if (sliderInterval.current) {
      clearInterval(sliderInterval.current)
    }

    const tick = () => {
      savedNextImageCallbackRef.current?.()
    }

    const intervalDuration = currentImageIndex === 0 ? 3000 : 7000
    sliderInterval.current = setInterval(tick, intervalDuration)

    return () => {
      if (sliderInterval.current) {
        clearInterval(sliderInterval.current)
      }
    }
  }, [currentImageIndex])

  const handleNavClick = (label: string) => {
    console.log(`Clicked on ${label}`)
    if (activeDropdown) {
      setActiveDropdown(null)
      setActiveSection(null)
    }
    if (isMobile) {
      setMobileMenuOpen(false)
    }
    if (label === "Gallery" || label === "Contact") {
      const sectionId = label.toLowerCase()
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
    if (label === "About") {
      window.location.href = "/about"
    }
  }

  const handleDropdownToggle = (label: string) => {
    if (label !== "Services") {
      handleNavClick(label)
      return
    }
    if (activeDropdown === label) {
      setActiveDropdown(null)
      setActiveSection(null)
    } else {
      setActiveDropdown(label)
      setActiveSection("services")
    }
  }

  const handleNavItemMouseLeave = (label: string) => {
    if (dropdownRef.current && !dropdownRef.current.matches(":hover")) {
      setActiveDropdown(null)
      setActiveSection(null)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (activeDropdown) {
      setActiveDropdown(null)
      setActiveSection(null)
    }
  }

  const dropdownVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeInOut" } },
  }

  const navItemVariants = {
    initial: { backgroundColor: "white" },
    hover: {
      backgroundColor: "white",
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  }

  const navbarItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.2,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      y: -16,
      transition: {
        duration: 0.3,
        opacity: { duration: 0.2 },
        ease: "easeInOut",
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        opacity: { duration: 0.3, delay: 0.1 },
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const mobileMenuItemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section
      className={`flex flex-col md:flex-row gap-8 md:gap-12 w-full ${isMobile ? "items-center" : "items-start"} px-4 sm:px-6 md:px-8`}
    >
      <div className="flex flex-col w-full md:w-[56%]">
        <div
          ref={navbarRef}
          className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-8 md:mb-12 lg:mb-16"
        >
          <div
            className={`relative z-[100] flex ${isMobile ? "justify-center w-full items-center" : "justify-start"} mb-4 md:mb-0`}
          >
            <motion.div
              initial={{ filter: "blur(15px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <picture>
                {isMobile ? (
                  <Image
                    width={280}
                    height={80}
                    className="w-[250px] h-auto"
                    src={logoImageSrc}
                    alt="UCS GROUP logo"
                    priority
                    loading="eager"
                    unoptimized
                  />
                ) : (
                  <Image
                    width={250}
                    height={60}
                    className="w-[200px] lg:w-[250px] h-auto"
                    src={logoImageSrc}
                    alt="UCS GROUP logo"
                    priority
                    loading="eager"
                    unoptimized
                  />
                )}
              </picture>
            </motion.div>
            {isMobile && (
              <motion.button
                className="text-zinc-800 z-[110] absolute right-0"
                onClick={toggleMobileMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
              </motion.button>
            )}
          </div>
          {!isMobile && (
            <motion.nav
              className="flex flex-wrap gap-2 sm:gap-2.5 justify-end text-sm md:text-base font-medium whitespace-nowrap text-zinc-600"
              style={{ zIndex: 100 }}
            >
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={navbarItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.button
                      ref={(el) => {
                        if (el) {
                          navItemRefs.current.current[index] = el
                        }
                      }}
                      onClick={() => (item.hasDropdown ? handleDropdownToggle(item.label) : handleNavClick(item.label))}
                      onMouseEnter={() => item.hasDropdown && handleDropdownToggle(item.label)}
                      onMouseLeave={() => item.hasDropdown && handleNavItemMouseLeave(item.label)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 tracking-tighter rounded-[50px] transition-colors cursor-pointer font-poppins
                      ${activeSection === item.label.toLowerCase() ? "" : ""}`}
                      variants={navItemVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <motion.div>
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
          )}
        </div>
        <AnimatePresence>
          {isMobile && mobileMenuOpen && (
            <motion.nav
              className="flex flex-wrap justify-center gap-2 w-full mb-3 overflow-hidden bg-white sticky top-[72px] z-40 py-1"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={index}
                    variants={mobileMenuItemVariants}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-[50px] bg-white text-zinc-800 font-medium"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (item.hasDropdown) {
                        handleDropdownToggle(item.label)
                      } else {
                        handleNavClick(item.label)
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <motion.div
                        animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </motion.nav>
          )}
        </AnimatePresence>
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
        <AnimatePresence>
          {isMobile && activeDropdown && (
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
                <Header activeSection={activeSection || "gallery"} margintop="mt-16" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <motion.div
          className="flex flex-col w-full md:pl-4 lg:pl-8 xl:pl-12 md:pt-10 lg:pt-16 xl:pt-24"
          animate={{ marginTop: isMobile && mobileMenuOpen ? 48 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div
            ref={headingRef}
            className={`${isMobile ? "scale-100 origin-top" : "scale-[0.89] origin-top-left"} text-[3.2rem] sm:text-[4rem] md:text-[5.2rem] lg:text-[5.9rem] tracking-tighter leading-none text-black mt-[-30px] flex flex-col ${isMobile ? "items-center text-center" : "items-start"}`}
          >
            {isMobile ? (
              <>
                <div className="text-container flex flex-col items-center" style={{ position: "relative", minHeight: "95px" }}>
                  <StableCharByCharText
                    text="Reliable and Affordable supply"
                    className="font-light font-merryweather text-center text-[2.4rem] sm:text-[2.9rem]"
                    initialDelay={0.1}
                    staggerDelay={0}
                  />
                  <StableCharByCharText
                    text="from agriculture to construction"
                    className="mt-1 sm:mt-2 text-[1.8rem] sm:text-[2.3rem] md:text-[2.8rem] font-bold tracking-tight leading-none text-black font-poppins text-center"
                    initialDelay={0.1 + 0.8}
                    staggerDelay={0}
                  />
                </div>
              </>
            ) : (
              /* Desktop view: Updated layout */
              <>
                <div className="text-container flex flex-col" style={{ position: "relative", minHeight: "160px" }}>
                  <StableCharByCharText
                    text="Reliable and Affordable supply"
                    className="font-light font-merryweather text-[2.8rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[4.9rem]"
                    initialDelay={0.1}
                    staggerDelay={0}
                  />
                  <StableCharByCharText
                    text="from agriculture to construction"
                    className="self-start mt-1 sm:mt-2 text-[1.8rem] sm:text-[2.3rem] md:text-[2.8rem] lg:text-[3.3rem] font-bold tracking-tight leading-none text-black font-poppins"
                    initialDelay={0.1 + 0.8}
                    staggerDelay={0}
                  />
                </div>
              </>
            )}
          </div>
          <motion.div
            className={`${isMobile ? "mt-1 sm:mt-2" : "mt-4 md:mt-6"} text-[0.8625rem] sm:text-[0.9875rem] md:text-[1.1125rem] lg:text-[1.3625rem] font-light tracking-tetter leading-relaxed text-gray-500 ${isMobile ? "text-center" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            From agricultural raw materials to construction materials,<br className="hidden sm:inline" /> we offer reliable supply solutions based on quality and sustainability with our wide range of products
          </motion.div>
        </motion.div>
      </div>
      <div className="flex flex-col w-full md:w-[44%] relative md:-mt-2.5">
        <div
          className="relative w-full overflow-hidden max-h-[100vh] rounded-3xl flex justify-end"
          style={{
            filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.35))",
            WebkitFilter: "drop-shadow(0 25px 25px rgba(0,0,0,0.35))",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            // Set fixed aspect ratio to prevent layout shifts
            aspectRatio: "3/4",
          }}
        >
          <div
            className={`relative w-full h-[50vh] md:h-[95vh] object-cover rounded-[40px] overflow-hidden`}
            style={{
              maxWidth: "100%",
              minHeight: isMobile ? "400px" : "600px",
              transform: "translateZ(0)",
              WebkitTransform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              // WebkitMaskImage removed to fix split loading appearance
            }}
          >
            <div className="relative w-full h-full">
              <div className="relative w-full h-full">
                {heroImages.map((imageSrc, index) => {
                  const isActive = index === currentImageIndex
                  return (
                    <motion.div
                      key={`hero-image-${index}`}
                      className="absolute inset-0"
                      style={{
                        zIndex: isActive ? 10 : 5,
                        opacity: isActive ? 1 : 0,
                      }}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                      }}
                      transition={{
                        opacity: {
                          duration: 0.9,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      <Image
                        src={heroSliderImageSources[index]}
                        onError={() => handleHeroSliderImageError(index)}
                        alt={`Agriculture hero image ${index + 1}`}
                        fill
                        style={{
                          objectFit: "cover",
                          transform: "translateZ(0)",
                          WebkitTransform: "translateZ(0)",
                          width: "100%",
                          height: "100%",
                        }}
                        priority={index === 0}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        loading={index === 0 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                        className="object-cover"
                        quality={100}
                        unoptimized
                      />
                    </motion.div>
                  )
                })}
              </div>
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isTransitioning) {
                        setIsTransitioning(true)
                        setCurrentImageIndex(index)
                        setTimeout(() => setIsTransitioning(false), 1000)
                        if (sliderInterval.current) {
                          clearInterval(sliderInterval.current)
                          sliderInterval.current = setInterval(nextImage, 3000)
                        }
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index ? "bg-white w-4" : "bg-white/50"}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Hero