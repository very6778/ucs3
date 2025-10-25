"use client"

import { IconArrowNarrowRight } from "@tabler/icons-react"
import type React from "react"

import { useRef, useId, useEffect } from "react"
import { MoveLeft, MoveRight } from "lucide-react"

interface SlideData {
  title: string
  src: string
  index: number
}

interface SlideProps {
  slide: SlideData
  index: number
  current: number
  handleSlideClick: (index: number) => void
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null)

  const xRef = useRef(0)
  const yRef = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return

      const x = xRef.current
      const y = yRef.current

      slideRef.current.style.setProperty("--x", `${x}px`)
      slideRef.current.style.setProperty("--y", `${y}px`)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2))
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2))
  }

  const handleMouseLeave = () => {
    xRef.current = 0
    yRef.current = 0
  }

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1"
  }

  const { src, title, index: slideIndex } = slide

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 "
        onClick={() => handleSlideClick(slideIndex)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: current !== index ? "scale(0.98) rotateX(8deg)" : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[10%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform: current === index ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)" : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />

          {current === index && <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />}

          {/* Text centered inside image */}
          {current === index && (
            <div className="absolute inset-0 flex items-center justify-center p-[4vmin]">
              <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold text-white text-center transition-opacity duration-1000 ease-in-out">
                {title}
              </h2>
            </div>
          )}
        </div>
      </li>
    </div>
  )
}

interface CarouselControlProps {
  type: string
  title: string
  handleClick: () => void
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${type === "previous" ? "rotate-180" : ""
        }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  )
}

interface CarouselProps {
  slides: SlideData[]
  onSlideChange: (index: number) => void
  onSlideClick: (index: number) => void
  currentIndex: number
}

export default function Carousel({ slides, onSlideChange, onSlideClick, currentIndex }: CarouselProps) {
  const handlePreviousClick = () => {
    const previous = currentIndex - 1
    onSlideChange(previous < 0 ? slides.length - 1 : previous)
  }

  const handleNextClick = () => {
    const next = currentIndex + 1
    onSlideChange(next === slides.length ? 0 : next)
  }

  const id = useId()

  return (
    <div className="relative w-[70vmin] h-[70vmin] mx-auto" aria-labelledby={`carousel-heading-${id}`}>
      <ul
        className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
        }}
      >
        {slides.map((slide, index) => (
          <Slide key={index} slide={slide} index={index} current={currentIndex} handleSlideClick={onSlideClick} />
        ))}
      </ul>

      <div className="absolute flex justify-center w-full top-[calc(100%+1rem)]">
        <button
          onClick={handlePreviousClick}
          className="h-16 w-16 sm:h-16 sm:w-16 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-all duration-100"
        >
          <MoveLeft className="h-14 w-14 sm:h-14 sm:w-14 text-black" />
          <span className="sr-only">Previous image</span>
        </button>

        <button
          onClick={handleNextClick}
          className="h-16 w-16 sm:h-16 sm:w-16 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-all duration-100"
        >
          <MoveRight className="h-14 w-14 sm:h-14 sm:w-14 text-black" />
          <span className="sr-only">Next image</span>
        </button>
      </div>
    </div>
  )
}