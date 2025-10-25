"use client"

import { Plane, Globe, Lightbulb, Trees, ShieldCheck, ClipboardCheck, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { BentoGrid } from "@/components/magicui/bento-grid"
import React from "react"
import { motion, useInView } from "framer-motion"; 
import { useAnimation } from "framer-motion"; 
import Image from "next/image"; // Import next/image
import AdvantageBentoCard from './AdvantageBentoCard'; // Yeni bileşeni import et

interface Feature {
  Icon: React.FC<any>;
  name: string;
  description: string;
  cta: string;
  background: React.ReactNode;
  className: string;
}

const features: Feature[] = [
  {
    Icon: Lightbulb,
    name: "Market Intelligence Support",
    description:
      "We provide more than just products — we deliver insights.\nBy regularly analyzing international market trends and price movements, we offer data-driven support to guide your purchasing decisions.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/7.webp`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/7.webp"; }}
        alt="Market Intelligence"
        fill
        className="object-cover opacity-80"
        unoptimized
      />
    ),
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-1 lg:col-end-3",
  },
  {
    Icon: Globe,
    name: "Strong Presence in Key Ports",
    description:
      "The right port, the right solution.\nWith our active presence in strategic ports such as Novorossiysk, Mersin, and Iskenderun, we ensure your operations run smoothly and on time.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/8.webp`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/8.webp"; }} // Use e.currentTarget for next/image
        alt="Key Ports"
        fill // Use fill instead of w-full h-full for next/image
        className="object-cover opacity-80"
        unoptimized // Add unoptimized for local fallback
      />
    ),
    className: "lg:row-start-1 lg:row-end-2 lg:col-start-3 lg:col-end-4",
  },
  {
    Icon: Plane,
    name: "End-to-End Delivery Capability",
    description:
      "Seamless delivery from port to plant.\nBy managing sea and land transportation through an integrated approach, we ensure your products reach their final destination safely and on time.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/9.jpg`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/9.jpg"; }} // Use e.currentTarget for next/image
        alt="End-to-End Delivery"
        fill // Use fill instead of w-full h-full for next/image
        className="object-cover opacity-80"
        unoptimized // Add unoptimized for local fallback
      />
    ),
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-1 lg:col-end-2",
  },
  {
    Icon: Trees,
    name: "Expert Product Knowledge",
    description:
      "We know the grain market inside out.\nFocusing on high-protein wheat, corn, barley, and soybeans, we deliver quality-driven and need-specific solutions. Our expertise is what sets us apart in the field.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/10.jpg`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/10.jpg"; }} // Use e.currentTarget for next/image
        alt="Product Knowledge"
        fill // Use fill instead of w-full h-full for next/image
        className="object-cover opacity-80"
        unoptimized // Add unoptimized for local fallback
      />
    ),
    className: "lg:row-start-2 lg:row-end-3 lg:col-start-2 lg:col-end-4",
  },
  {
    Icon: ShieldCheck,
    name: "Trusted Supplier Network",
    description:
      "Strong partnerships, reliable supply.\nThrough selective collaborations with direct producers and exporters, we ensure high quality and full traceability in every shipment.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/14.webp`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/14.webp"; }} // Use e.currentTarget for next/image
        alt="Supplier Network"
        fill // Use fill instead of w-full h-full for next/image
        className="object-cover opacity-80"
        unoptimized // Add unoptimized for local fallback
      />
    ),
    className: "lg:row-start-3 lg:row-end-4 lg:col-start-1 lg:col-end-3",
  },
  {
    Icon: ClipboardCheck,
    name: "Quality and Analysis Assurance",
    description:
      "Quality control in every batch, confidence in every delivery.\nWe meticulously verify product compliance with technical standards through pre-loading laboratory analyses, including moisture and protein testing. Each shipment is backed by our commitment to consistent and sustainable quality.",
    cta: "Learn more",
    background: (
      <Image
        src={`${process.env.NEXT_PUBLIC_CDN_URL}/15.webp`}
        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src="/15.webp"; }} // Use e.currentTarget for next/image
        alt="Quality Assurance"
        fill // Use fill instead of w-full h-full for next/image
        className="object-cover opacity-80"
        unoptimized // Add unoptimized for local fallback
      />
    ),
    className: "lg:row-start-3 lg:row-end-4 lg:col-start-3 lg:col-end-4",
  },
];

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: Feature | null;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, feature }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setAnimationClass("opacity-0 scale-95");
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setAnimationClass("opacity-100 scale-100");
      }, 50);
      return () => clearTimeout(timer);
    } else if (isVisible) {
      setAnimationClass("opacity-0 scale-95");
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'auto';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out bg-opacity-50 backdrop-blur-sm"
        style={{
          opacity: animationClass.includes("opacity-0") ? 0 : 1
        }}
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-3xl shadow-xl max-w-2xl w-full mx-4 transform transition-all duration-300 ease-in-out ${animationClass}`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X size={24} />
        </button>
        <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
          {/* The background is already handled by the Feature interface and BentoCard */}
          {feature?.background}
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">{feature?.description}</p>
          <p className="text-gray-600">
            Learn more about our {feature?.name?.toLowerCase()} advantage and how it can benefit your business.
            Contact our team for a personalized consultation.
          </p>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OurAdvantages() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null); 

  const isSectionInView = useInView(sectionRef, { amount: 0.2, once: true });

  const titleControls = useAnimation();

  useEffect(() => {
    if (isSectionInView) {
      titleControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeInOut", delay: 0.1 },
      });
    } else {
      titleControls.start({ opacity: 0, y: 20, transition: { duration: 0 } });
    }
  }, [isSectionInView, titleControls]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="flex flex-col items-center w-full relative bg-white text-gray-900 min-h-screen"
    >
      <div className="w-full min-h-screen flex items-center justify-center overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="w-full mb-12"
            initial={{ opacity: 0 }} // Simple fade-in for the whole section content area
            animate={isSectionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              ref={titleRef}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-center text-gray-900"
              initial={{ opacity: 0, y: 20 }} // Initial state for title
              animate={titleControls} // Controlled by titleControls
            >
              <span className="font-light">Our</span> Advantages
            </motion.h2>
          </motion.div>

          <div 
            className="mt-8 md:mt-12"
          >
            <BentoGrid className="lg:grid-rows-2 lg:grid-cols-3 w-full md:w-4/5 mx-auto">
              {features.map((feature, index) => (
                <AdvantageBentoCard
                  key={feature.name}
                  index={index}
                  {...feature} // Feature proplarını doğrudan geç
                  isSectionInView={isSectionInView} // Bölüm görünürlük durumunu prop olarak geç
                  onClick={() => openModal(feature)}
                />
              ))}
            </BentoGrid>
          </div>
        </div>
      </div>
      <FeatureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        feature={selectedFeature}
      />
    </section>
  );
}