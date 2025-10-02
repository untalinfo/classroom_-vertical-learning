import { useCallback, useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';

// Point workerSrc at the packaged worker from pdfjs-dist
// The import path is resolved at runtime in Vite when building.
// We set it at runtime to '/node_modules/pdfjs-dist/build/pdf.worker.min.js' as a fallback — Vite will serve node_modules in dev.
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore
    GlobalWorkerOptions.workerSrc = (window as any).__pdfWorkerSrc || '/node_modules/pdfjs-dist/build/pdf.worker.min.js';
  } catch (e) {
    // ignore
  }
}

export const usePdfDocument = (url?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const docRef = useRef<any | null>(null);

  // Simple module-level cache to avoid fetching the same PDF multiple times
  // Cache stores a promise that resolves to the PDFDocumentProxy
  // eslint-disable-next-line no-var
  if (!(globalThis as any).__pdfDocCache) {
    (globalThis as any).__pdfDocCache = new Map<string, Promise<any>>();
  }
  const pdfDocCache: Map<string, Promise<any>> = (globalThis as any).__pdfDocCache;

  // Page render cache: map url -> map pageNumber -> Promise<dataUrl>
  if (!(globalThis as any).__pdfPageCache) {
    (globalThis as any).__pdfPageCache = new Map<string, Map<number, Promise<string>>>();
  }
  const pdfPageCache: Map<string, Map<number, Promise<string>>> = (globalThis as any).__pdfPageCache;

  useEffect(() => {
    let canceled = false;
    if (!url) return;
    setLoading(true);
    setError(null);
    setNumPages(null);

    let docPromise = pdfDocCache.get(url);
    if (!docPromise) {
      const loadingTask = getDocument(url);
      docPromise = loadingTask.promise;
      pdfDocCache.set(url, docPromise);
      // Do not call loadingTask.destroy here; keep document in cache for reuse
    }

    docPromise
      .then((doc) => {
        if (canceled) return;
        docRef.current = doc;
        setNumPages(doc.numPages || null);
        try { console.debug('[usePdfDocument] loaded document', { url, numPages: doc.numPages }); } catch (e) { }
      })
      .catch((err) => {
        if (canceled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        try { console.error('[usePdfDocument] error loading document', url, err); } catch (e) { }
      })
      .finally(() => {
        if (canceled) return;
        setLoading(false);
      });

    return () => {
      canceled = true;
      // keep cached document for future reuse
    };
  }, [url]);

  const renderPageToDataUrl = useCallback(async (pageNumber: number, scale = 1.5): Promise<string> => {
    if (!url) throw new Error('No PDF URL provided');

    // Check per-page cache first
    let pageMap = pdfPageCache.get(url);
    if (!pageMap) {
      pageMap = new Map<number, Promise<string>>();
      pdfPageCache.set(url, pageMap);
    }
    const existing = pageMap.get(pageNumber);
    if (existing) return existing;

    const p = (async () => {
      try {
        // Ensure we have the document; if docRef isn't set yet, wait for the cached promise
        let doc = docRef.current;
        if (!doc) {
          const docPromise = pdfDocCache.get(url);
          if (!docPromise) throw new Error('PDF not loaded');
          doc = await docPromise;
          docRef.current = doc;
        }
        console.debug('[usePdfDocument] rendering page', { url, pageNumber, scale });
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context unavailable');
        const renderContext = {
          canvasContext: ctx,
          viewport,
        };
        await page.render(renderContext).promise;
        const dataUrl = canvas.toDataURL('image/png');
        console.debug('[usePdfDocument] rendered page to dataUrl', { url, pageNumber });
        return dataUrl;
      } catch (err) {
        console.error('[usePdfDocument] error rendering page', { url, pageNumber, err });
        throw err;
      }
    })();

    pageMap.set(pageNumber, p);
    return p;
  }, [url]);

  return { loading, error, numPages, renderPageToDataUrl };
};

export default usePdfDocument;
