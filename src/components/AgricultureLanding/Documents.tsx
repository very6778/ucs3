"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import jsonData from '@/lib/pdfData.json';
import Image from "next/image";
import { useState } from "react";

interface Document {
  title: string
  description: string
  url: string
}

interface JsonDocument {
  file: string;
  title: string;
  description: string;
}

interface DocumentsProps {
  documents?: Document[]
}

const transformedDocuments: Document[] = (jsonData as JsonDocument[]).map(item => ({
  title: item.title,
  description: item.description,
  url: `/pdfs/${item.file}`,
}));

const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export default function Documents({ documents = transformedDocuments }: DocumentsProps) {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  }

  const handleOpenDocument = (doc: Document) => {
    const filename = doc.url.split('/').pop()

    if (filename) {
      router.push(`/view?file=${encodeURIComponent(filename)}`)
    } else {
      console.error("Could not extract filename from URL:", doc.url)
    }
  }

  const cdnPdfIconUrl = NEXT_PUBLIC_CDN_URL ? `${NEXT_PUBLIC_CDN_URL}/pdf.png` : "/pdf.png";
  const localPdfIconUrl = "/pdf.png";
  const [pdfIconSrc, setPdfIconSrc] = useState(cdnPdfIconUrl);

  const handlePdfIconError = () => {
    if (pdfIconSrc === cdnPdfIconUrl) {
      setPdfIconSrc(localPdfIconUrl);
    }
  };

  return (
    <motion.section
      className="overflow-hidden px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 py-16 md:py-24 bg-white"
      id="docs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header
        className="px-4 sm:px-8 md:px-16 py-8 md:py-14 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none text-center text-lime-700 bg-lime-50 rounded-[20px] md:rounded-[44px] mb-10 md:mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Our Documents</h2>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10"
      >
        {documents.map((doc, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-lime-700 rounded-[20px] md:rounded-[32px] overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            onClick={() => handleOpenDocument(doc)}
          >
            <div className="px-6 md:px-8 pt-4 md:pt-6">
              <h3 className="font-bold text-2xl md:text-3xl text-white">{doc.title}</h3>
            </div>

            <div className="px-6 md:px-8">
              <hr className="border-t border-lime-200 opacity-50 my-4" />
            </div>

            <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col md:flex-row gap-6 flex-grow">
              <div className="md:w-1/4 aspect-square relative flex justify-center items-center">
                <Image
                  src={pdfIconSrc}
                  alt="PDF Icon"
                  fill
                  className="object-contain"
                  onError={handlePdfIconError}
                  unoptimized
                />
              </div>

              <div className="md:w-3/4 flex flex-col">
                <p className="text-white text-lg leading-relaxed mb-6">{doc.description}</p>

                <div className="mt-auto flex justify-start">
                  <button
                    className="px-6 py-3 bg-lime-600 hover:bg-lime-500 text-white font-medium rounded-full transition-colors flex items-center gap-2 text-base"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenDocument(doc)
                    }}
                  >
                    View Document
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}