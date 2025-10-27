"use client"

import React, { useState, useEffect } from "react"
import CallFeatureCard from "./CallFeaturesCard"
import ExploreCard from "./ExploreCard"
import { Phone, PhoneForwarded, FileBarChart, PieChart, DollarSign, Wheat, Building2 } from "lucide-react"

interface CallFeaturesProps {
  activeSection: "services" | "gallery"
  margintop?: string
}

const callFeaturesData = [
  { icon: Phone, title: "Call Tracking", description: "Use insight to improve marketing strategy" },
  { icon: PhoneForwarded, title: "Call Routing", description: "Never miss calls with relevant routing" },
  { icon: Phone, title: "Call Tracking", description: "Use insight to improve marketing strategy" },
  { icon: FileBarChart, title: "Call Reporting", description: "Analyze call data to boost conversion" },
  { icon: PieChart, title: "Call Attribution", description: "Determine productive channels" },
  { icon: DollarSign, title: "Pay Per Call", description: "Monitor commission" },
]

const serviceFeaturesData = [
  { icon: Wheat, title: "Agricultural products", description: "Reliable, cost‑effective agricultural sourcing." },
  { icon: Building2, title: "Construction building materials", description: "Standards‑compliant materials delivered on time." },
]

const Header: React.FC<CallFeaturesProps> = ({ activeSection, margintop = "pt-14 pb-0 sm:pt-18 sm:pb-[9px]" }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleFeatureClick = (index: number) => {
    console.log(`Feature ${index + 1} clicked`)
  }

  const handleExploreClick = () => {
    const el = document.getElementById('products')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDiscoverClick = () => {
    console.log("Discover button clicked")
  }

  let content

  if (activeSection === "gallery") {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 items-start mt-4 w-full max-md:max-w-full">
        {callFeaturesData.map((feature, index) => (
          <CallFeatureCard key={index} {...feature} onClick={() => handleFeatureClick(index)} />
        ))}
      </div>
    )
  } else if (activeSection === "services") {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 items-start mt-10 sm:mt-12 w-full max-md:max-w-full">
        {serviceFeaturesData.map((feature, index) => (
          <CallFeatureCard key={index} {...feature} onClick={() => handleFeatureClick(index)} />
        ))}
      </div>
    )
  } else {
    content = (
      <p>Sorry, an error occurred. Please try again. If the problem persists, please try to refresh the page.</p>
    )
  }

  return (
    <div className="flex justify-center w-full z-50">
      {" "}
      <div className="flex flex-col rounded-none max-w-[1200px] w-full px-4 sm:px-6 lg:px-8 relative">
        {" "}
        <div className={`flex flex-col items-start ${margintop} w-full bg-white ${windowWidth < 360 ? 'pt-32 custom-padding' : ''}`}>
          <div className="hidden md:flex flex-wrap gap-10 ml-5 max-w-full w-[776px]" />
          <div className={`flex flex-col pt-6 pb-[9px] sm:pt-9 sm:pb-[21px] px-4 sm:px-8 w-full bg-white rounded-2xl max-w-full relative z-10 ${margintop} md:mt-0}`}>
            {" "}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="flex flex-col flex-1 shrink basis-0 min-w-[240px] max-md:max-w-full">
                {activeSection === "gallery" && (
                  <div className="text-sm sm:text-base text-neutral-400 max-md:max-w-full mb-2">Gallery</div>
                )}
                {content}
              </div>
              <div className="flex flex-col w-full sm:w-80 min-w-[240px] mt-4 sm:mt-0">
                <div className="flex flex-col w-full">
                  <div className="text-sm sm:text-base text-neutral-400 mb-2">Explore</div>
                  <ExploreCard
                    imageSrc="/our-main.webp"
                    title=""
                    description="See what we supply across agriculture and construction"
                    onClick={handleExploreClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header