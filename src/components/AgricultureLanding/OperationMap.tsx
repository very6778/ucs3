"use client"

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';

// Lazy load the Mapbox component with a loading state
const DynamicMapboxComponent = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <div style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0'}}>Loading Map...</div>
});

const OperationMap: React.FC = () => {
  // State to track if the map section is visible or near viewport
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip if running on server or if IntersectionObserver is not available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // If the map section is intersecting (visible or near viewport)
        if (entries[0].isIntersecting) {
          setIsMapVisible(true);
          // Once visible, no need to observe anymore
          if (mapSectionRef.current) observer.unobserve(mapSectionRef.current);
        }
      },
      {
        // Start loading when the element is 300px away from viewport
        rootMargin: '300px',
        threshold: 0.1
      }
    );
    
    // Start observing the map section
    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }
    
    return () => {
      if (mapSectionRef.current) observer.unobserve(mapSectionRef.current);
    };
  }, []);
  
  return (
    <section ref={mapSectionRef} className="w-full py-48 md:py-64 lg:py-96 px-4">
      <div className="max-w-6xl lg:max-w-7xl mx-auto flex flex-col items-center">
        <motion.div 
          className="text-center mb-6 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-none text-neutral-800"
          >
            <motion.span 
              className="font-bold block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Operation Map
            </motion.span>
            <motion.span 
              className="text-black font-black block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              
            </motion.span>
          </motion.h2>
          <motion.div
            className="w-20 h-1.5 bg-black my-4 mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </motion.div>
        
        <motion.div 
          className="w-full bg-gray-50 rounded-[48px] shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <div className="map-wrapper h-[60vh] md:h-[70vh] lg:h-[80vh]">
            {isMapVisible ? <MapboxMap /> : 
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-[48px]">
                <div className="text-gray-500 text-lg">Map will load when scrolled into view</div>
              </div>
            }
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const MapboxMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    
    const preventScroll = (e: WheelEvent) => {
      e.stopPropagation();
    };
    
    if (container) {
      container.addEventListener('wheel', preventScroll, { passive: false }); // Cannot be passive because it uses preventDefault()
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', preventScroll);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      onTouchMove={(e) => e.stopPropagation()}
    >
      <DynamicMapboxComponent />
    </div>
  );
};

export default OperationMap;