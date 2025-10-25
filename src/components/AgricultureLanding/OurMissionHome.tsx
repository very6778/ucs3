"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Marquee from "react-fast-marquee"
import Lenis from "@studio-freight/lenis"

interface CounterProps {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration = 2500, className = "", suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(countRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const normalizedProgress = Math.min(progress / duration, 1);
      const easedProgress = normalizedProgress;

      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, end, duration]);

  return (
    <span ref={countRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};

const statsForMobileCards = [
  {
    title: "20% Productivity",
    description: "20% boost in productivity through better teamwork.",
    value: 20,
    suffix: "%"
  },
  {
    title: "35k Designs",
    description: "35k interiors designed since 2022 with Faded.",
    value: 35,
    suffix: "k"
  },
  {
    title: "700+ Projects",
    description: "Scalability for 700+ evolving project needs.",
    value: 700,
    suffix: "+"
  },
];

interface CardProps {
  i: number;
  title: string;
  description: string;
  value: number;
  suffix: string;
  progress: any;
  range: [number, number];
  targetScale: number;
  inView: boolean;
}

const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  value,
  suffix,
  progress,
  range,
  targetScale,
  inView
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { scrollYProgress: cardScrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(progress, range, [1, targetScale]);
  const cardIsInView = useInView(container, { once: true, amount: 0.1 });

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
  };
  const hoverGlow = "0 0 30px 5px rgba(255, 230, 150, 0.3)";
  const getStaticTopPosition = `calc(-5vh + ${i * 25}px)`;

  // Determine the static gradient based on card index 'i'
  const staticGradient =
    i === 0
      ? 'conic-gradient(from 0deg at 45% 45%, hsl(45, 100%, 75%) 0%, hsl(47, 100%, 65%) 25%, hsl(40, 95%, 60%) 50%, hsl(43, 90%, 65%) 75%, hsl(45, 100%, 75%) 100%)'
      : i === 1
        ? 'conic-gradient(from 90deg at 55% 40%, hsl(39, 95%, 65%) 0%, hsl(37, 90%, 55%) 25%, hsl(35, 85%, 50%) 40%, hsl(38, 90%, 60%) 75%, hsl(39, 95%, 65%) 100%)'
        : 'conic-gradient(from 180deg at 40% 55%, hsl(36, 90%, 60%) 0%, hsl(34, 85%, 50%) 30%, hsl(32, 80%, 45%) 60%, hsl(35, 85%, 55%) 85%, hsl(36, 90%, 60%) 100%)';

  return (
    <div ref={container} className="flex items-center justify-center sticky top-0 px-2 sm:px-3 md:px-4 min-h-[500px] md:min-h-[600px]">
      <motion.div
        style={{
          background: staticGradient, // Use the static gradient
          scale,
          top: getStaticTopPosition,
          boxShadow: "0 10px 30px rgba(150, 120, 40, 0.2)",
          backgroundBlendMode: "soft-light",
          backgroundSize: "200% 200%",
          position: "relative",
          overflow: "hidden"
        }}
        whileHover={isMounted ? {
          boxShadow: hoverGlow,
          y: -5,
          transition: { duration: 0.5 }
        } : undefined}
        className="flex flex-col relative w-full max-w-[95vw] h-[380px] md:h-[450px] rounded-3xl p-6 sm:p-10 origin-top"
      >
        <div className="absolute w-[30%] h-[30%] rounded-full animate-pulse" style={{ top: i === 0 ? "15%" : i === 1 ? "20%" : "10%", right: i === 0 ? "25%" : i === 1 ? "20%" : "30%", background: i === 0 ? "radial-gradient(circle, rgba(255, 230, 150, 0.9) 20%, rgba(255, 220, 100, 0) 70%)" : i === 1 ? "radial-gradient(circle, rgba(255, 215, 130, 0.8) 20%, rgba(255, 200, 80, 0) 70%)" : "radial-gradient(circle, rgba(255, 200, 110, 0.7) 20%, rgba(255, 180, 60, 0) 70%)", filter: "blur(30px)", zIndex: 0 }}></div>
        <div className="absolute w-[40%] h-[40%] rounded-full" style={{ bottom: i === 0 ? "15%" : i === 1 ? "20%" : "25%", right: i === 0 ? "8%" : i === 1 ? "12%" : "5%", background: i === 0 ? "radial-gradient(circle, rgba(255, 220, 130, 0.7) 0%, rgba(255, 210, 90, 0) 70%)" : i === 1 ? "radial-gradient(circle, rgba(255, 200, 110, 0.6) 0%, rgba(255, 190, 70, 0) 70%)" : "radial-gradient(circle, rgba(255, 180, 90, 0.5) 0%, rgba(255, 170, 50, 0) 70%)", filter: "blur(35px)", zIndex: 0 }}></div>
        <div className="absolute w-[20%] h-[20%] rounded-full" style={{ top: i === 0 ? "25%" : i === 1 ? "30%" : "20%", left: i === 0 ? "15%" : i === 1 ? "10%" : "20%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)", filter: "blur(25px)", zIndex: 0 }}></div>

        <motion.div
          className="flex flex-col h-full relative z-10"
          variants={cardContentVariants}
          initial="hidden"
          animate={cardIsInView && inView ? "visible" : "hidden"}
        >
          <div className="flex flex-col h-full justify-between">
            <div className="w-full">
              <h3 className="text-7xl md:text-8xl font-bold text-black relative z-10" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
                {inView && cardIsInView ?
                  <Counter end={value} suffix={suffix} className="text-8xl md:text-9xl font-bold text-black" />
                  : `0${suffix}`
                }
              </h3>
            </div>
            <div className="w-full mt-auto">
              <p className="text-black text-2xl md:text-4xl font-semibold">{description}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const MissionSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Yeni eklenen state - logoların önceden yüklenmesi için
  const [logosPreloaded, setLogosPreloaded] = useState(false);
  const [allLogosLoaded, setAllLogosLoaded] = useState(false);
  const [logoLoadStatus, setLogoLoadStatus] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setIsMounted(true);
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Logoların önceden yüklenmesi
    preloadLogos();
    
    // Minimum bekleme süresi - en az 0.5 saniye göster
    const minWaitTimeout = setTimeout(() => {
      setLogosPreloaded(true);
    }, 500);
    
    // Maksimum bekleme süresi - 4 saniye içinde logolar yüklenmezse göster
    const maxWaitTimeout = setTimeout(() => {
      setLogosPreloaded(true);
      // Eğer 4 saniye sonra hala yüklenmediyse, animasyonu başlat
      setAllLogosLoaded(true);
    }, 4000);
    
    // Ek güvenlik için 6 saniye sonra her durumda marquee'i başlat
    const safetyTimeout = setTimeout(() => {
      setLogosPreloaded(true);
      setAllLogosLoaded(true);
    }, 6000);
    
    return () => {
      clearTimeout(minWaitTimeout);
      clearTimeout(maxWaitTimeout);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Logo yükleme durumu değiştiğinde kontrol et
  useEffect(() => {
    const statusKeys = Object.keys(logoLoadStatus);
    if (statusKeys.length > 0) {
      console.log(`Logo status updated. Loaded: ${statusKeys.length}`);
      // Eğer %80'den fazla logo durumu güncellendiyse animasyonu başlat
      if (statusKeys.length >= 14 * 0.8 && !allLogosLoaded) {
        console.log('Majority of logos status updated, starting animation');
        setTimeout(() => {
          setAllLogosLoaded(true);
        }, 200);
      }
    }
  }, [logoLoadStatus]);

  // Logoları önceden yükleyen fonksiyon
  const preloadLogos = () => {
    // Tüm benzersiz logolar (marquee'de 28 adet var - 14'ün iki kopyası)
    const uniqueLogoFiles = [
      'aag.png', 'agrova.png', 'aston.jpg', 'besleragro.png', 'ceynak.png',
      'corner.png', 'dmcompany.png', 'generalsurvey.png', 'grainstar.png', 'milano.png',
      'nifa.jpeg', 'tabangıda.png', 'yamansel.png'  // Sgs.png kaldırıldı
    ];
    
    let loadedCount = 0;
    let attemptCount = 0;
    const totalLogos = uniqueLogoFiles.length;
    
    // Tüm logolar yüklendiğinde state'i güncelle
    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`Logo loaded: ${loadedCount}/${totalLogos}`);
      if (loadedCount === totalLogos) {
        console.log('All logos loaded, starting animation in 300ms');
        // Daha uzun bir gecikme ekleyerek DOM'un güncellenmesini bekle
        setTimeout(() => {
          setAllLogosLoaded(true);
        }, 300);
      }
    };
    
    // En az %80'i yüklenirse animasyonu başlat
    const checkMostLoaded = () => {
      attemptCount++;
      if (attemptCount >= totalLogos * 0.8 && !allLogosLoaded) {
        console.log(`Most logos attempted (${attemptCount}/${totalLogos}), starting animation`);
        setTimeout(() => {
          setAllLogosLoaded(true);
        }, 100);
      }
    };
    
    uniqueLogoFiles.forEach((logoPath) => {
      // Önce local yolu dene (daha güvenilir)
      const localImg = new window.Image();
      const localTimeout = setTimeout(() => {
        console.warn(`Local loading timeout for ${logoPath}, trying CDN`);
        setLogoLoadStatus(prev => ({...prev, [logoPath]: 'local_timeout'}));
        localImg.onload = null;
        localImg.onerror = null;
        checkMostLoaded();
        
        // CDN'i dene
        const cdnImg = new window.Image();
        const cdnTimeout = setTimeout(() => {
          console.error(`CDN loading timeout for ${logoPath}`);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_timeout'}));
          checkAllLoaded();
          checkMostLoaded();
        }, 3000);
        
        cdnImg.onload = () => {
          clearTimeout(cdnTimeout);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_loaded'}));
          checkAllLoaded();
        };
        cdnImg.onerror = () => {
          clearTimeout(cdnTimeout);
          console.error(`Failed to load logo from CDN: ${logoPath}`);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_failed'}));
          checkAllLoaded();
        };
        const cdnUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${logoPath}`;
        cdnImg.src = cdnUrl;
      }, 3000);
      
      localImg.onload = () => {
        clearTimeout(localTimeout);
        setLogoLoadStatus(prev => ({...prev, [logoPath]: 'local_loaded'}));
        checkAllLoaded();
      };
      localImg.onerror = () => {
        clearTimeout(localTimeout);
        // Local yükleme başarısız olursa CDN'i dene
        console.warn(`Local failed for ${logoPath}, trying CDN`);
        setLogoLoadStatus(prev => ({...prev, [logoPath]: 'local_failed'}));
        checkMostLoaded();
        
        const cdnImg = new window.Image();
        const cdnTimeout = setTimeout(() => {
          console.error(`CDN loading timeout for ${logoPath}`);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_timeout'}));
          checkAllLoaded();
          checkMostLoaded();
        }, 3000);
        
        cdnImg.onload = () => {
          clearTimeout(cdnTimeout);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_loaded'}));
          checkAllLoaded();
        };
        cdnImg.onerror = () => {
          clearTimeout(cdnTimeout);
          console.error(`Failed to load logo from CDN: ${logoPath}`);
          setLogoLoadStatus(prev => ({...prev, [logoPath]: 'cdn_failed'}));
          checkAllLoaded();
        };
        const cdnUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/${logoPath}`;
        cdnImg.src = cdnUrl;
      };
      localImg.src = `/${logoPath}`;
    });
  };

  // Debug için logo yükleme durumunu izle
  useEffect(() => {
    console.log('Logo load status:', logoLoadStatus);
  }, [logoLoadStatus]);

  const desktopStatsContainerRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);

  const isStat1InView = useInView(stat1Ref, { once: true, amount: 0.3 });
  const isStat2InView = useInView(stat2Ref, { once: true, amount: 0.3 });
  const isStat3InView = useInView(stat3Ref, { once: true, amount: 0.3 });

  const { scrollYProgress: sectionScrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const quoteY = useTransform(sectionScrollYProgress, [0.5, 0.85], [0, -120]);
  const desktopStatsY = useTransform(sectionScrollYProgress, [0.5, 0.85], [0, -350]);

  const stat1AdditionalY = useTransform(sectionScrollYProgress, [0.5, 0.85], [0, -450]);
  const stat2AdditionalY = useTransform(sectionScrollYProgress, [0.5, 0.85], [0, 0]);
  const stat3AdditionalY = useTransform(sectionScrollYProgress, [0.5, 0.85], [0, -250]);

  const { scrollYProgress: scrollYProgressDesktopStats } = useScroll({
    target: desktopStatsContainerRef,
    offset: ["start end", "end start"],
  });

  const [stat1Animated, setStat1Animated] = useState(false);
  const [stat2Animated, setStat2Animated] = useState(false);
  const [stat3Animated, setStat3Animated] = useState(false);

  useEffect(() => { if (isStat1InView) setStat1Animated(true); }, [isStat1InView]);
  useEffect(() => { if (isStat2InView) setStat2Animated(true); }, [isStat2InView]);
  useEffect(() => { if (isStat3InView) setStat3Animated(true); }, [isStat3InView]);

  const desktopStat1Gradient = useTransform(scrollYProgressDesktopStats, [0, 0.33, 0.66, 1], ['radial-gradient(circle at 10% 20%, hsl(43, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 80% 30%, hsl(42, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 40% 80%, hsl(45, 90%, 75%) 0%, transparent 40%), linear-gradient(135deg, hsl(44, 96%, 78%), hsl(41, 92%, 68%))','radial-gradient(circle at 20% 30%, hsl(43, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 70% 20%, hsl(42, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 30% 90%, hsl(45, 90%, 75%) 0%, transparent 40%), linear-gradient(120deg, hsl(44, 96%, 78%), hsl(41, 92%, 68%))','radial-gradient(circle at 30% 10%, hsl(43, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 60% 40%, hsl(42, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 20% 70%, hsl(45, 90%, 75%) 0%, transparent 40%), linear-gradient(150deg, hsl(44, 96%, 78%), hsl(41, 92%, 68%))','radial-gradient(circle at 40% 40%, hsl(43, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 50% 60%, hsl(42, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 60% 50%, hsl(45, 90%, 75%) 0%, transparent 40%), linear-gradient(165deg, hsl(44, 96%, 78%), hsl(41, 92%, 68%))']);
  const desktopStat2Gradient = useTransform(scrollYProgressDesktopStats, [0, 0.33, 0.66, 1], ['radial-gradient(circle at 20% 30%, hsl(40, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 70% 10%, hsl(38, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 40% 90%, hsl(36, 90%, 63%) 0%, transparent 40%), linear-gradient(135deg, hsl(39, 96%, 65%), hsl(35, 92%, 60%))','radial-gradient(circle at 30% 20%, hsl(40, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 60% 30%, hsl(38, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 30% 80%, hsl(36, 90%, 63%) 0%, transparent 40%), linear-gradient(120deg, hsl(39, 96%, 65%), hsl(35, 92%, 60%))','radial-gradient(circle at 10% 40%, hsl(40, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(38, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 50% 70%, hsl(36, 90%, 63%) 0%, transparent 40%), linear-gradient(150deg, hsl(39, 96%, 65%), hsl(35, 92%, 60%))','radial-gradient(circle at 50% 30%, hsl(40, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 40% 80%, hsl(38, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 70% 60%, hsl(36, 90%, 63%) 0%, transparent 40%), linear-gradient(165deg, hsl(39, 96%, 65%), hsl(35, 92%, 60%))']);
  const desktopStat3Gradient = useTransform(scrollYProgressDesktopStats, [0, 0.33, 0.66, 1], ['radial-gradient(circle at 30% 20%, hsl(36, 100%, 75%) 0%, transparent 50%), radial-gradient(circle at 60% 40%, hsl(33, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsl(30, 90%, 55%) 0%, transparent 40%), linear-gradient(135deg, hsl(34, 96%, 60%), hsl(29, 92%, 55%))','radial-gradient(circle at 40% 30%, hsl(36, 100%, 75%) 0%, transparent 50%), radial-gradient(circle at 50% 20%, hsl(33, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 30% 70%, hsl(30, 90%, 55%) 0%, transparent 40%), linear-gradient(120deg, hsl(34, 96%, 60%), hsl(29, 92%, 55%))','radial-gradient(circle at 50% 10%, hsl(36, 100%, 75%) 0%, transparent 50%), radial-gradient(circle at 30% 60%, hsl(33, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 60% 80%, hsl(30, 90%, 55%) 0%, transparent 40%), linear-gradient(150deg, hsl(34, 96%, 60%), hsl(29, 92%, 55%))','radial-gradient(circle at 60% 50%, hsla(36, 100.00%, 75.10%, 0.74) 0%, transparent 50%), radial-gradient(circle at 20% 70%, hsl(33, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 40% 40%, hsl(30, 90%, 55%) 0%, transparent 40%), linear-gradient(165deg, hsl(34, 96%, 60%), hsl(29, 92%, 55%))']);

  const mobileStatsWrapperRef = useRef<HTMLDivElement>(null);
  const mobileCardsListRef = useRef<HTMLDivElement>(null);

  const isMobileStatsWrapperInView = useInView(mobileStatsWrapperRef, { once: true, amount: 0.1 });
  const { scrollYProgress: scrollYProgressMobileCards } = useScroll({
    target: mobileCardsListRef,
    offset: ["start start", "end end"],
  });

  const cdnCeoUrl = `${process.env.NEXT_PUBLIC_CDN_URL}/ceo.jpg`;
  const localCeoUrl = '/ceo.jpg';
  const [ceoImageSrc, setCeoImageSrc] = useState(cdnCeoUrl);

  const handleCeoImageError = () => {
    if (ceoImageSrc === cdnCeoUrl) {
      setCeoImageSrc(localCeoUrl);
    }
  };

  return (
    <section ref={sectionRef} className="w-full pt-16 md:pt-24 lg:pt-32 px-4 sm:px-6 md:px-8">
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 w-24 h-full z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
        <div className={`transition-opacity duration-500 ${logosPreloaded ? 'opacity-100' : 'opacity-0'}`}>
          <Marquee 
            speed={20} 
            pauseOnHover={true}
            gradient={true}
            gradientColor="#ffffff"
            gradientWidth={96}
            play={allLogosLoaded} // Tüm logolar yüklendiğinde animasyonu başlat
          >
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/aag.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/aag.png" }} alt="AAG" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/agrova.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/agrova.png" }} alt="Agrova" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/aston.jpg`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/aston.jpg" }} alt="Aston" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/besleragro.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/besleragro.png" }} alt="Besler Agro" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/ceynak.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/ceynak.png" }} alt="Ceynak" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/corner.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/corner.png" }} alt="Corner" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/dmcompany.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/dmcompany.png" }} alt="DM Company" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/generalsurvey.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/generalsurvey.png" }} alt="General Survey" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/grainstar.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/grainstar.png" }} alt="Grain Star" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/milano.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/milano.png" }} alt="Milano" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/nifa.jpeg`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/nifa.jpeg" }} alt="NIFA" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/tabangıda.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/tabangıda.png" }} alt="Taban Gıda" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/yamansel.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/yamansel.png" }} alt="Yaman Sel" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/aag.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/aag.png" }} alt="AAG" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/agrova.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/agrova.png" }} alt="Agrova" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/aston.jpg`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/aston.jpg" }} alt="Aston" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/besleragro.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/besleragro.png" }} alt="Besler Agro" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/ceynak.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/ceynak.png" }} alt="Ceynak" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/corner.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/corner.png" }} alt="Corner" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/dmcompany.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/dmcompany.png" }} alt="DM Company" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/generalsurvey.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/generalsurvey.png" }} alt="General Survey" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/grainstar.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/grainstar.png" }} alt="Grain Star" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/milano.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/milano.png" }} alt="Milano" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/nifa.jpeg`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/nifa.jpeg" }} alt="NIFA" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/tabangıda.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/tabangıda.png" }} alt="Taban Gıda" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex items-center justify-center w-32 h-8 mx-10">
              <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/yamansel.png`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/yamansel.png" }} alt="Yaman Sel" className="max-w-full max-h-full object-contain" />
            </div>
          </Marquee>
        </div>
        {!logosPreloaded && (
          // Yükleme göstergesi - marquee benzeri yapı
          <div className="flex overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="flex items-center justify-center w-32 h-8 mx-10">
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
        <div className="absolute right-0 top-0 w-24 h-full z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto my-16 md:my-32 lg:my-48">
        <div className="flex flex-col">
          <div className="w-full">
            <motion.div
              ref={quoteRef}
              className="relative bg-[#f8f8f8] rounded-3xl p-11 md:p-16 shadow-2xl mb-20 w-full max-w-6xl mx-auto text-center"
              style={{
                y: quoteY,
                zIndex: 1
              }}
            >
              <blockquote className="relative z-10">
                <h2 className="uppercase text-2xl font-bold text-gray-800 mb-7 tracking-wider">Our Mission</h2>
                <p className="text-2xl md:text-3xl lg:text-5xl font-manrope font-bold text-gray-800 mb-9 leading-relaxed">
                  "Our goal is to build a sustainable trade system where labor is valued, trust is the standard, and integrity defines every exchange."
                </p>
                <footer className="flex flex-row items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={ceoImageSrc}
                      onError={handleCeoImageError}
                      alt="CEO portrait"
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-medium text-black text-lg">Özcan Uca</p>
                    <p className="text-base text-gray-500">CEO</p>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
          </div>
        </div>

        <motion.div
          ref={desktopStatsContainerRef}
          className="hidden md:block mt-0 mb-8 relative"
          style={{
            y: desktopStatsY,
            zIndex: 2
          }}
        >
          <div className="flex flex-col md:flex-row gap-20 items-start justify-center relative z-1">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative" style={{ zIndex: "1" }}>
              {/* Stat Card 1 (20%) */}
              <motion.div
                ref={stat1Ref}
                className="rounded-3xl py-11 px-11 flex flex-col justify-between overflow-hidden relative"
                style={{
                  y: stat1AdditionalY,
                  height: '456px',
                  width: '100%',
                  background: 'radial-gradient(circle at 10% 20%, hsl(43, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 80% 30%, hsl(42, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 40% 80%, hsl(45, 90%, 75%) 0%, transparent 40%), linear-gradient(135deg, hsl(44, 96%, 78%), hsl(41, 92%, 68%))',
                  backgroundBlendMode: 'soft-light, screen, normal',
                  backgroundSize: "100% 100%",
                  boxShadow: "0 10px 30px rgba(150, 120, 40, 0.2)",
                  position: "relative"
                }}
              >
                <div className="absolute w-[30%] h-[30%] rounded-full animate-pulse" style={{top: "15%", right: "25%", background: "radial-gradient(circle, rgba(255, 230, 150, 0.9) 20%, rgba(255, 220, 100, 0) 70%)", filter: "blur(30px)", zIndex: 0 }}></div>
                <div className="absolute w-[40%] h-[40%] rounded-full" style={{ bottom: "15%", right: "8%", background: "radial-gradient(circle, rgba(255, 220, 130, 0.7) 0%, rgba(255, 210, 90, 0) 70%)", filter: "blur(35px)", zIndex: 0 }}></div>
                <div className="absolute w-[20%] h-[20%] rounded-full" style={{ top: "25%", left: "15%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)", filter: "blur(25px)", zIndex: 0 }}></div>

                <h3 className="text-7xl md:text-8xl font-bold text-black relative z-10" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
                  {isStat1InView ? <Counter end={20} suffix="%" className="text-7xl md:text-8xl font-bold text-black" /> : "0%"}
                </h3>
                <div className="w-full absolute bottom-0 left-0 p-11 z-10 bg-transparent backdrop-blur-none">
                  <p className="text-black text-lg font-semibold">20% boost in productivity through better teamwork.</p>
                </div>
              </motion.div>

              {/* Stat Card 2 (35k) */}
              <motion.div
                ref={stat2Ref}
                className="rounded-3xl py-11 px-11 flex flex-col justify-between overflow-hidden relative"
                style={{
                  y: stat2AdditionalY,
                  height: '456px',
                  width: '100%',
                  background: 'radial-gradient(circle at 20% 30%, hsl(40, 100%, 80%) 0%, transparent 50%), radial-gradient(circle at 70% 10%, hsl(38, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 40% 90%, hsl(36, 90%, 63%) 0%, transparent 40%), linear-gradient(135deg, hsl(39, 96%, 65%), hsl(35, 92%, 60%))',
                  backgroundBlendMode: 'soft-light, screen, normal',
                  backgroundSize: "100% 100%",
                  boxShadow: "0 10px 30px rgba(150, 120, 40, 0.2)",
                  position: "relative"
                }}
              >
                <div className="absolute w-[30%] h-[30%] rounded-full animate-pulse" style={{ top: "20%", right: "20%", background: "radial-gradient(circle, rgba(255, 215, 130, 0.8) 20%, rgba(255, 200, 80, 0) 70%)", filter: "blur(30px)", zIndex: 0 }}></div>
                <div className="absolute w-[40%] h-[40%] rounded-full" style={{ bottom: "20%", right: "12%", background: "radial-gradient(circle, rgba(255, 200, 110, 0.6) 0%, rgba(255, 190, 70, 0) 70%)", filter: "blur(35px)", zIndex: 0 }}></div>
                <div className="absolute w-[20%] h-[20%] rounded-full" style={{ top: "30%", left: "10%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)", filter: "blur(25px)", zIndex: 0 }}></div>

                <h3 className="text-7xl md:text-8xl font-bold text-black relative z-10" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
                  {stat1Animated ? <Counter end={35} suffix="k" className="text-7xl md:text-8xl font-bold text-black" /> : "0k"}
                </h3>
                <div className="w-full absolute bottom-0 left-0 p-11 z-10 bg-transparent backdrop-blur-none">
                  <p className="text-black text-lg font-semibold">35k interiors designed since 2022 with Faded.</p>
                </div>
              </motion.div>

              {/* Stat Card 3 (+700) */}
              <motion.div
                ref={stat3Ref}
                className="rounded-3xl py-11 px-11 flex flex-col justify-between overflow-hidden relative"
                style={{
                  y: stat3AdditionalY,
                  height: '456px',
                  width: '100%',
                  background: 'radial-gradient(circle at 30% 20%, hsl(36, 100%, 75%) 0%, transparent 50%), radial-gradient(circle at 60% 40%, hsl(33, 95%, 65%) 0%, transparent 60%), radial-gradient(circle at 20% 80%, hsl(30, 90%, 55%) 0%, transparent 40%), linear-gradient(135deg, hsl(34, 96%, 60%), hsl(29, 92%, 55%))',
                  backgroundBlendMode: 'soft-light, screen, normal',
                  backgroundSize: "100% 100%",
                  boxShadow: "0 10px 30px rgba(150, 120, 40, 0.2)",
                  position: "relative"
                }}
              >
                <div className="absolute w-[30%] h-[30%] rounded-full animate-pulse" style={{ top: "10%", right: "30%", background: "radial-gradient(circle, rgba(255, 200, 110, 0.7) 20%, rgba(255, 180, 60, 0) 70%)", filter: "blur(30px)", zIndex: 0 }}></div>
                <div className="absolute w-[40%] h-[40%] rounded-full" style={{ bottom: "25%", right: "5%", background: "radial-gradient(circle, rgba(255, 180, 90, 0.5) 0%, rgba(255, 170, 50, 0) 70%)", filter: "blur(35px)", zIndex: 0 }}></div>
                <div className="absolute w-[20%] h-[20%] rounded-full" style={{ top: "20%", left: "20%", background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)", filter: "blur(25px)", zIndex: 0 }}></div>

                <h3 className="text-7xl md:text-8xl font-bold text-black relative z-10" style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)" }}>
                  {stat2Animated ? <Counter end={700} prefix="+" duration={2500} className="text-7xl md:text-8xl font-bold text-black" /> : "+0"}
                </h3>
                <div className="w-full absolute bottom-0 left-0 p-11 z-10 bg-transparent backdrop-blur-none">
                  <p className="text-black text-lg font-semibold">Scalability for 700+ evolving project needs.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          ref={mobileStatsWrapperRef}
          className="block md:hidden mt-20 mb-40"
          initial={{ opacity: 0, y: 40 }}
          animate={isMobileStatsWrapperInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div ref={mobileCardsListRef} className="relative">
            {statsForMobileCards.map((stat, i) => {
              const targetScale = 1 - (statsForMobileCards.length - i) * 0.05;
              const rangeStart = i * 0.25;
              const rangeEnd = 1;

              return (
                <Card
                  key={`stat_mobile_${i}`}
                  i={i}
                  title={stat.title}
                  description={stat.description}
                  value={stat.value}
                  suffix={stat.suffix || ""}
                  progress={scrollYProgressMobileCards}
                  range={[rangeStart, rangeEnd]}
                  targetScale={targetScale}
                  inView={isMobileStatsWrapperInView}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;