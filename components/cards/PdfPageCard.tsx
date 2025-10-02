import React, { useEffect, useState } from 'react';
import type { PdfPageCard } from '../../types';
import ImageCardComponent from './ImageCard';
import { CardType } from '../../types';
import usePdfDocument from '../../hooks/usePdfDocument';

interface PdfPageCardProps {
  card: PdfPageCard;
  isActive?: boolean;
  isNearby?: boolean;
}

const isPdfUrl = (url: string) => url.toLowerCase().endsWith('.pdf');

const PdfPageCardComponent: React.FC<PdfPageCardProps> = ({ card, isActive = false, isNearby = false }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loading: docLoading, error: docError, numPages, renderPageToDataUrl } = usePdfDocument(isPdfUrl(card.url) ? card.url : undefined);

  useEffect(() => {
    let mounted = true;
    setError(null);
    // If url isn't a PDF, just use it directly
    if (!isPdfUrl(card.url)) {
      setDataUrl(card.url);
      return;
    }

  // Only render when active or nearby (prefetch strategy)
  if (!isActive && !isNearby) return;

    if (docError) {
      setError(String(docError));
      return;
    }
    if (docLoading) return;
    setLoading(true);
    renderPageToDataUrl(card.pageNumber)
      .then((d) => { if (mounted) setDataUrl(d); })
      .catch((e) => { if (mounted) setError(String(e)); })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, [card.url, card.pageNumber, docLoading, docError, isActive, isNearby]);

  // no-op

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      {loading || docLoading ? (
        <div className="text-white">Loading PDF page...</div>
      ) : error ? (
        <div className="text-red-400">Error loading page: {error}</div>
      ) : dataUrl ? (
        // Reuse ImageCardComponent by coercing to Image card shape
        <ImageCardComponent card={{ ...card, type: CardType.Image, url: dataUrl, alt: `PDF Page ${card.pageNumber}` } as any} />
      ) : (
        <div className="text-white">No preview available</div>
      )}

      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
        Page {card.pageNumber}{numPages ? ` / ${numPages}` : ''}
      </div>
    </div>
  );
};

export default PdfPageCardComponent;
