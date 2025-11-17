'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRAND_COLORS } from '@/lib/constants';

interface PDFPreviewProps {
  previewUrl?: string;
  bookTitle: string;
  totalPages?: number;
}

export function PDFPreview({
  previewUrl,
  bookTitle,
  totalPages = 5
}: PDFPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!previewUrl) {
    return (
      <section className="py-12 border-t">
        <h2 className="text-2xl font-bold text-dark mb-6">Book Preview</h2>
        <div className="bg-light rounded-lg p-12 text-center">
          <p className="text-gray mb-4">Preview not available for this book</p>
          <p className="text-sm text-gray">Purchase the book to read the full content</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-t">
      <h2 className="text-2xl font-bold text-dark mb-6">Preview (First {totalPages} Pages)</h2>

      <div className="rounded-lg overflow-hidden shadow-elevation-3 bg-gray-900">
        {/* PDF Viewer */}
        <div className="bg-white p-4 md:p-8 min-h-96 flex items-center justify-center">
          <div className="text-center">
            <iframe
              src={previewUrl}
              title={`${bookTitle} Preview`}
              className="w-full h-96 rounded border"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <Button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="text-sm">{currentPage} / {totalPages}</span>

          <Button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            size="sm"
            className="text-white border-white hover:bg-white/10"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray mt-4">
        This is a preview of the first {totalPages} pages. Purchase to access the full book.
      </p>
    </section>
  );
}
