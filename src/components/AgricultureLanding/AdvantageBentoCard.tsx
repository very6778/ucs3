"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { BentoCard, BentoCardProps } from '@/components/magicui/bento-grid';
import Image from 'next/image';
import { LucideProps } from 'lucide-react';

// Feature interface (OurAdvantages.tsx dosyasından kopyalandı veya ortak bir dosyadan import edilebilir)
interface Feature {
  Icon: React.FC<LucideProps>; // Daha spesifik bir tip kullanalım
  name: string;
  description: string;
  cta: string;
  background: React.ReactNode; // Bu zaten bir Image bileşeni içeriyor
  className: string;
}

interface AdvantageBentoCardProps extends Feature {
  index: number;
  onClick: () => void;
  isSectionInView: boolean; // Ana bölümün görünürlük durumu
}

const AdvantageBentoCard: React.FC<AdvantageBentoCardProps> = ({
  Icon,
  name,
  description,
  cta,
  background,
  className,
  index,
  onClick,
  isSectionInView,
}) => {
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  // Kartın kendisinin görünürlüğünü de izleyebiliriz, ancak şimdilik bölüm görünürlüğünü kullanalım
  // const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const cardVariants = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -200 : 200, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.15 }, // Her kart için hafif bir gecikme
    },
  };

  useEffect(() => {
    if (isSectionInView) {
      controls.start('visible');
    } else {
      controls.start('hidden'); // Bölüm görünümden çıkarsa (once: true değilse)
    }
  }, [isSectionInView, controls]);

  // BentoCard'a geçilecek propları hazırlayalım
  const bentoCardProps: BentoCardProps = {
    Icon: Icon as React.ComponentType<any>, // BentoCard'ın beklediği tipe cast edelim
    name: name,
    description: description,
    cta: cta,
    background: background,
    className: className, // Bu motion.div'e uygulanacak, BentoCard'ın kendi className'i olabilir
    nameClassName: "text-xl font-semibold text-white",
    descriptionClassName: "text-white",
    cardClassName: "bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm h-80",
    ctaClassName: "text-white hover:text-black",
    iconClassName: "text-white",
  };

  return (
    <motion.div
      ref={cardRef}
      className={className} // className prop'unu motion.div'e uyguluyoruz
      initial="hidden"
      animate={controls}
      variants={cardVariants}
    >
      <BentoCard {...bentoCardProps} onClick={onClick} />
    </motion.div>
  );
};

export default AdvantageBentoCard;
