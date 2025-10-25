"use client"

import { Suspense } from 'react'
import PdfViewerPage from '@/components/AgricultureLanding/PDFViewer'

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lime-700"></div>
        <p className="mt-4 text-lg text-zinc-700">Loading document...</p>
      </div>
    }>
      <PdfViewerPage />
    </Suspense>
  )
}