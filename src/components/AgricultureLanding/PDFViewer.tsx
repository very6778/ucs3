"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Document, Page } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { GlobalWorkerOptions } from "pdfjs-dist"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

import pdfData from '@/lib/pdfData.json'

GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString()

interface DocumentProps {
    title: string
    description: string
    url: string
}

interface PdfMeta {
    file: string;
    title: string;
    description: string;
}
const pdfDatabase: PdfMeta[] = pdfData as PdfMeta[];

interface PdfViewerPageProps {
    defaultDocument?: DocumentProps
}

export default function PdfViewerPage({ defaultDocument }: PdfViewerPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(getDefaultScale())

    const [documentMetadata, setDocumentMetadata] = useState<DocumentProps | null>(null)
    const [isMetadataLoading, setIsMetadataLoading] = useState<boolean>(true)
    const [metadataError, setMetadataError] = useState<string | null>(null)

    const [isPdfFileLoading, setIsPdfFileLoading] = useState<boolean>(true)
    const [pdfFileError, setPdfFileError] = useState<Error | null>(null)


    const MIN_ZOOM = 0.50
    const MAX_ZOOM = 2.50
    const DEFAULT_ZOOM = 1.0

    useEffect(() => {
        setIsMetadataLoading(true)
        setMetadataError(null)
        setDocumentMetadata(null)

        setIsPdfFileLoading(true)
        setPdfFileError(null)
        setNumPages(null)
        setPageNumber(1)
        setScale(getDefaultScale())

        const fileParam = searchParams?.get('file')

        if (fileParam) {
            const foundPdf = pdfDatabase.find(
                pdf => pdf.file.toLowerCase() === fileParam.toLowerCase()
            )

            if (foundPdf) {
                setDocumentMetadata({
                    title: foundPdf.title,
                    description: foundPdf.description,
                    url: `/pdfs/${foundPdf.file}`
                })
            } else {
                console.warn(`PDF metadata for '${fileParam}' not found in database. Using filename as title.`)
                setDocumentMetadata({
                    title: fileParam.split('.')[0].replace(/[-_]/g, ' ').trim() || 'PDF Document',
                    description: `Viewing document: ${fileParam}.`,
                    url: `/pdfs/${fileParam}`
                })
            }
        } else if (defaultDocument) {
            setDocumentMetadata(defaultDocument)
        } else {
            setMetadataError("No PDF document specified. Please provide a 'file' query parameter in the URL (e.g., ?file=yourfile.pdf).")
        }
        setIsMetadataLoading(false)
    }, [searchParams, defaultDocument])

    function getDefaultScale() {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            if (width < 640) return 0.6;
            if (width < 768) return 0.8;
            return 1.0;
        }
        return 1.0;
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setScale(getDefaultScale());
            window.addEventListener('resize', handleResize);
            setScale(getDefaultScale());
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);


    function onDocumentLoadSuccess({ numPages: loadedNumPages }: { numPages: number }) {
        setNumPages(loadedNumPages)
        setIsPdfFileLoading(false)
        setPdfFileError(null)
    }

    function onDocumentLoadError(error: Error) {
        console.error("Error loading PDF document file:", error);
        setPdfFileError(error)
        setIsPdfFileLoading(false)
    }

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => {
            const newPageNumber = prevPageNumber + offset
            return Math.max(1, Math.min(numPages || 1, newPageNumber))
        })
    }

    const previousPage = () => changePage(-1)
    const nextPage = () => changePage(1)
    const zoomIn = () => setScale((s) => Math.min(parseFloat((s + 0.2).toFixed(2)), MAX_ZOOM))
    const zoomOut = () => setScale((s) => Math.max(parseFloat((s - 0.2).toFixed(2)), MIN_ZOOM))

    function resetZoom() {
        setScale(getDefaultScale())
    }

    const ZOOM_TOLERANCE = 0.01;
    const isZoomInDisabled = scale >= MAX_ZOOM - ZOOM_TOLERANCE;
    const isZoomOutDisabled = scale <= MIN_ZOOM + ZOOM_TOLERANCE;
    const isResetDisabled = Math.abs(scale - getDefaultScale()) < ZOOM_TOLERANCE;

    if (isMetadataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lime-700"></div>
                <p className="mt-4 text-lg text-zinc-700">Loading document information...</p>
            </div>
        )
    }

    if (metadataError && !documentMetadata) {
        return (
            <div className="container mx-auto p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Document Error</h1>
                    <p className="text-zinc-700">{metadataError}</p>
                    <button
                        onClick={() => router.push('/about#docs')}
                        className="mt-6 bg-lime-700 text-white px-6 py-2 rounded-lg hover:bg-lime-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    if (!documentMetadata) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 p-4">
                <p className="text-xl text-zinc-700">No document information available to display.</p>
            </div>
        )
    }

    const controlsDisabled = isPdfFileLoading || !!pdfFileError;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="flex flex-col min-h-screen bg-zinc-50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.header
                className="bg-lime-700 p-4 sm:p-6 shadow-md sticky top-0 z-20"
                variants={itemVariants}
            >
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate pr-4" title={documentMetadata.title}>
                        {documentMetadata.title}
                    </h1>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-white hover:text-lime-200 transition-colors p-2 rounded-full hover:bg-lime-800/50 text-sm"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-5 h-5 mr-1" /> Back
                    </button>
                </div>
            </motion.header>

            <div className="container mx-auto p-4 sm:p-6">
                <motion.div
                    className="bg-lime-50 p-4 sm:p-6 rounded-lg shadow"
                    variants={itemVariants}
                >
                    {metadataError && <p className="text-sm text-orange-600 mb-2">{metadataError}</p>}
                    <p className="text-zinc-700 text-lg">{documentMetadata.description}</p>
                </motion.div>
            </div>

            <motion.main
                className="flex-grow container mx-auto px-4 sm:px-6 pb-6 flex flex-col"
                variants={itemVariants}
            >
                <div className="bg-white rounded-lg shadow-xl h-full flex flex-col overflow-hidden flex-grow">
                    <div className="flex flex-wrap justify-between items-center p-3 border-b bg-zinc-50 sticky z-10">
                        <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-0">
                            <button
                                onClick={previousPage}
                                disabled={controlsDisabled || pageNumber <= 1}
                                className={`p-2 rounded-full ${(controlsDisabled || pageNumber <= 1) ? "text-gray-400 cursor-not-allowed" : "text-lime-700 hover:bg-lime-100"}`}
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-zinc-700">
                                Page {isPdfFileLoading || pdfFileError ? "?" : pageNumber} of {isPdfFileLoading || pdfFileError ? "?" : (numPages || "?")}
                            </span>
                            <button
                                onClick={nextPage}
                                disabled={controlsDisabled || pageNumber >= (numPages || 1)}
                                className={`p-2 rounded-full ${(controlsDisabled || pageNumber >= (numPages || 1)) ? "text-gray-400 cursor-not-allowed" : "text-lime-700 hover:bg-lime-100"}`}
                                aria-label="Next page"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                                onClick={zoomOut}
                                disabled={controlsDisabled || isZoomOutDisabled}
                                className={`p-2 rounded-full ${(controlsDisabled || isZoomOutDisabled) ? "text-gray-400 cursor-not-allowed" : "text-lime-700 hover:bg-lime-100"}`}
                                aria-label="Zoom out"
                            >
                                <ZoomOut className="w-5 h-5" />
                            </button>
                            <span className="text-sm w-12 text-center text-zinc-700">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={zoomIn}
                                disabled={controlsDisabled || isZoomInDisabled}
                                className={`p-2 rounded-full ${(controlsDisabled || isZoomInDisabled) ? "text-gray-400 cursor-not-allowed" : "text-lime-700 hover:bg-lime-100"}`}
                                aria-label="Zoom in"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                            <button
                                onClick={resetZoom}
                                disabled={controlsDisabled || isResetDisabled}
                                className={`p-2 rounded-full ${(controlsDisabled || isResetDisabled) ? "text-gray-400 cursor-not-allowed" : "text-lime-700 hover:bg-lime-100"}`}
                                aria-label="Reset zoom"
                            >
                                <RotateCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-grow flex justify-center p-2 sm:p-4 bg-zinc-200 relative overflow-auto min-h-[500px]">
                        {isPdfFileLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
                                <p className="mt-3 text-zinc-600">Loading PDF...</p>
                            </div>
                        )}

                        {pdfFileError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-white/90 p-4 z-10">
                                <p className="font-semibold text-lg">Error loading PDF document</p>
                                <p className="text-sm text-zinc-700 mt-1 max-w-md text-center">{pdfFileError.message}</p>
                                <p className="text-xs text-zinc-500 mt-2">File: {documentMetadata.url}</p>
                            </div>
                        )}

                        {documentMetadata.url && !pdfFileError && (
                            <div className={`pdf-container w-full overflow-auto ${isPdfFileLoading || pdfFileError ? 'opacity-0' : 'opacity-100'}`}>
                                <Document
                                    file={documentMetadata.url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    className="flex justify-center"
                                >
                                    {numPages && (
                                        <Page
                                            pageNumber={pageNumber}
                                            scale={scale}
                                            renderTextLayer={true}
                                            renderAnnotationLayer={true}
                                            className="shadow-lg"
                                            width={undefined}
                                        />
                                    )}
                                </Document>
                            </div>
                        )}
                        {!isPdfFileLoading && !pdfFileError && !documentMetadata.url && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-orange-600 bg-white/90 p-4 z-10">
                                <p className="font-semibold text-lg">No document file available to display</p>
                                <p className="text-sm text-zinc-700 mt-1 max-w-md text-center">Check the configuration or the 'file' parameter in the URL.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.main>
        </motion.div>
    )
}