"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const PdfViewerPage = dynamic(() => import('@/components/AgricultureLanding/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lime-700"></div>
      <p className="mt-4 text-lg text-zinc-700">Loading document...</p>
    </div>
  )
})

export default function ViewPage() {
  return (
    <Suspense fallback={null}>
      <PdfViewerPage />
    </Suspense>
  )
}
