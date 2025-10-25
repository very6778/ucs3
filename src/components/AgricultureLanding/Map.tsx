"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl, { LngLatLike, LngLatBounds } from "mapbox-gl";
import { IoMdRefresh } from "react-icons/io";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

console.log('Mapbox Access Token:', mapboxgl.accessToken ? 'Set' : 'Not set');
if (!mapboxgl.accessToken) {
  console.error(
    "Mapbox Access Token is not set. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment."
  );
}

const locations = [
  { id: 1, name: "Mersin", description: "Main Transportation Hub", x: 34.6415, y: 36.8121 },
  { id: 2, name: "Süleymaniye", description: "Regional Operations Center", x: 45.43, y: 35.55 },
  { id: 3, name: "Habur", description: "Border Transport Gateway", x: 42.38, y: 37.15 },
  { id: 5, name: "Novorossiysk", description: "Strategic Partnership Location", x: 37.77, y: 44.72 },
  { id: 6, name: "Yeysk", description: "Distribution Center", x: 38.28, y: 46.71 },
  { id: 7, name: "Rostov", description: "General Office", x: 39.72, y: 47.23 },
];

const mapStyle = "mapbox://styles/mapbox/standard";

type LightPreset = "day" | "dusk" | "dawn" | "night";
const lightPresets: LightPreset[] = ["day", "dusk", "dawn", "night"];

const calculateCenterOfLocations = () => {
  if (locations.length === 0) return [0, 0]; 

  let sumX = 0;
  let sumY = 0;
  
  locations.forEach(location => {
    sumX += location.x;
    sumY += location.y;
  });
  
  return [sumX / locations.length, sumY / locations.length];
};

const calculateBounds = (): LngLatBounds => {
  const bounds = new LngLatBounds();
  
  locations.forEach(location => {
    bounds.extend([location.x, location.y]);
  });
  
  return bounds;
};

const calculateSouthernShiftedCenter = (bounds: LngLatBounds, shiftDegrees: number): [number, number] => {
    const center = bounds.getCenter();
    const shiftedLat = center.lat - shiftDegrees; 
    return [center.lng, shiftedLat];
};

const MapboxMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [currentLightPreset, setCurrentLightPreset] = useState<LightPreset>("dawn");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);

  const initialZoom = 1; 
  const targetZoom = 5;
  const animationDuration = 7000; 
  const animationEasing = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  
  const finalPitch = 50;
  const finalBearing = 25;
  const southernShiftDegrees = 1.5;

  useEffect(() => {
    console.log('Map useEffect triggered', { 
      mapExists: !!map.current, 
      containerExists: !!mapContainer.current, 
      tokenExists: !!mapboxgl.accessToken 
    });
    
    if (map.current || !mapContainer.current || !mapboxgl.accessToken) return;

    const centerCoords = calculateCenterOfLocations();
    console.log('Creating map with center:', centerCoords);

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: centerCoords as LngLatLike,
        zoom: initialZoom, 
        pitch: 30, 
        bearing: 40, 
        projection: { name: "globe" }, 
        renderWorldCopies: false, 
      });
      console.log('Map created successfully');
    } catch (error) {
      console.error('Error creating map:', error);
      return;
    }

    map.current.on("load", () => {
      console.log('Map loaded successfully');
      if (!map.current) return;
      
      try {
        map.current.setConfigProperty("basemap", "lightPreset", currentLightPreset);
      } catch (error) {
        console.warn('Could not set light preset:', error);
      }

      locations.forEach((location) => {
        new mapboxgl.Marker()
          .setLngLat([location.x, location.y] as LngLatLike)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${location.name}</strong><p>${location.description}</p>`
            )
          )
          .addTo(map.current!);
      });
      
      const bounds = calculateBounds();
      const targetPitch = 60; 
      const targetBearing = 65; 

      const cameraOptionsForAnimation = map.current.cameraForBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 }, 
        pitch: targetPitch, 
        bearing: targetBearing, 
      });

      const animationEndCenter: [number, number] = cameraOptionsForAnimation
        ? [mapboxgl.LngLat.convert(cameraOptionsForAnimation.center!).lng, mapboxgl.LngLat.convert(cameraOptionsForAnimation.center!).lat]
        : (centerCoords as [number, number]);
      
      const animationEndZoom: number = cameraOptionsForAnimation
        ? (cameraOptionsForAnimation.zoom ?? targetZoom)
        : targetZoom; 

      startSmoothZoomAnimation(
        map.current,
        animationEndCenter,    
        initialZoom,           
        animationEndZoom,      
        0, 
        targetPitch,           
        0, 
        targetBearing,         
        animationDuration,
        animationEasing,
        () => {
          setInitialAnimationComplete(true);
          
          const southernShiftedCenter = calculateSouthernShiftedCenter(bounds, southernShiftDegrees);

          map.current?.easeTo({
            center: southernShiftedCenter as LngLatLike,
            zoom: targetZoom,
            pitch: finalPitch,
            bearing: finalBearing,
            duration: 2000,
            easing: animationEasing
          });
          
          setTimeout(() => {
            setUiVisible(true);
          }, 500);
        }
      );
    });
    
    return () => {
      console.log('Cleaning up map');
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); 

  const startSmoothZoomAnimation = (
    mapInstance: mapboxgl.Map,
    targetCenter: [number, number],
    startZoom: number,
    endZoom: number,
    startPitch: number,
    endPitch: number,
    startBearing: number,
    endBearing: number,
    duration: number,
    easingFn: (t: number) => number,
    onComplete: () => void
  ) => {
    const startTime = performance.now();
    const startCenter = mapInstance.getCenter();
    
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const elapsedRatio = Math.min(elapsedTime / duration, 1);
      const easedProgress = easingFn(elapsedRatio);
      
      const zoom = startZoom + (endZoom - startZoom) * easedProgress;
      const pitch = startPitch + (endPitch - startPitch) * easedProgress;
      const bearing = startBearing + (endBearing - startBearing) * easedProgress;
      
      const lng = startCenter.lng + (targetCenter[0] - startCenter.lng) * easedProgress;
      const lat = startCenter.lat + (targetCenter[1] - startCenter.lat) * easedProgress;
      
      mapInstance.jumpTo({
        center: [lng, lat],
        zoom: zoom,
        pitch: pitch,
        bearing: bearing
      });
      
      if (elapsedRatio < 1) {
        requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setConfigProperty("basemap", "lightPreset", currentLightPreset);
    }
  }, [currentLightPreset]);

  useEffect(() => {
    const handleResize = () => {
      if (map.current && initialAnimationComplete) {
        const bounds = calculateBounds();
        const southernShiftedCenter = calculateSouthernShiftedCenter(bounds, southernShiftDegrees);

        map.current.easeTo({
          center: southernShiftedCenter as LngLatLike,
          zoom: targetZoom,
          pitch: finalPitch,
          bearing: finalBearing,
          duration: 1000,
          easing: animationEasing
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initialAnimationComplete]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      
      if (map.current && initialAnimationComplete) {
        setTimeout(() => {
          const bounds = calculateBounds();
           const southernShiftedCenter = calculateSouthernShiftedCenter(bounds, southernShiftDegrees);
           map.current?.easeTo({
               center: southernShiftedCenter as LngLatLike,
               zoom: targetZoom,
               pitch: 0,
               bearing: 0,
               duration: 1000
           });
        }, 100);
      }
    };
    
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, [initialAnimationComplete]);

  return (
    <div className="relative w-full h-screen">
      <div 
        className={`absolute top-4 left-4 z-10 overflow-hidden rounded-md transition-opacity duration-500 ease-in-out ${uiVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundColor: "#1E1F23", padding: "4px" }}
      >
        <div className="flex space-x-1">
          {lightPresets.map((preset) => {
            return (
              <button
                key={preset}
                onClick={() => setCurrentLightPreset(preset)}
                className={`px-4 py-2 transition-all duration-300 ease-in-out rounded-md font-medium ${
                  currentLightPreset === preset 
                    ? 'text-white ' 
                    : ''
                }`}
                style={{ 
                  backgroundColor: currentLightPreset === preset ? "#494F5B" : "#1E1F23",
                  color: currentLightPreset === preset ? "white" : "#8D8C88"
                }}
              >
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          if (map.current && initialAnimationComplete) {
            const bounds = calculateBounds();
            const southernShiftedCenter = calculateSouthernShiftedCenter(bounds, southernShiftDegrees);

            map.current.easeTo({
              center: southernShiftedCenter as LngLatLike,
              zoom: targetZoom,
              pitch: finalPitch,
              bearing: finalBearing,
              duration: 1500,
              easing: animationEasing
            });
          }
        }}
        className={`absolute top-4 right-16 z-10 p-2 rounded-full shadow-md focus:outline-none transition-opacity duration-500 ease-in-out ${uiVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-label="Reset view"
        style={{ backgroundColor: "#1E1F23", color: "#8D8C88" }}
      >
        <IoMdRefresh className="w-6 h-6" />
      </button>

      <button
        onClick={toggleFullScreen}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full shadow-md focus:outline-none transition-opacity duration-500 ease-in-out ${uiVisible ? 'opacity-100' : 'opacity-0'}`}
        aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        style={{ backgroundColor: "#1E1F23", color: "#8D8C88" }}
      >
        {isFullScreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"></path><path d="M21 8h-3a2 2 0 0 1-2-2V3"></path><path d="M3 16h3a2 2 0 0 1 2 2v3"></path><path d="M16 21v-3a2 2 0 0 1 2-2h3"></path></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path></svg>
        )}
      </button>

      <div
        ref={mapContainer}
        className="map-container"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default MapboxMap;