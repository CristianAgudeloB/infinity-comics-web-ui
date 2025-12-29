import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicById } from "../api/comics.api";
import type { Comic } from "../types/comic";

type ReadingMode = "page" | "cascade";

export default function ComicReader() {
  const { id } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<ReadingMode>("page");

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    getComicById(id)
      .then(setComic)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (comic) {
      document.title = `Leyendo: ${comic.title} - Infinity Comics`;
    } else {
      document.title = "Lector - Infinity Comics";
    }
  }, [comic]);

  useEffect(() => {
    setImageLoading(true);
  }, [currentPage]);

  const totalPages = comic?.pages?.length || 0;
  const currentImage = comic?.pages?.[currentPage];

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  useEffect(() => {
    if (!comic || !comic.onlineRead || totalPages === 0) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Solo manejar navegación por teclado en modo página
      if (readingMode === "page") {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNextPage();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrevPage();
        }
      }
      if (e.key === 'Escape') {
        setShowControls(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [comic, totalPages, goToNextPage, goToPrevPage, readingMode]);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Cargando lector...</p>
        </div>
      </div>
    );
  }

  if (!comic || !comic.onlineRead || !comic.pages || comic.pages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="text-center">
          <p className="text-zinc-400 text-lg mb-4">Este cómic no está disponible para lectura online</p>
          <Link to={`/comic/${id}`} className="text-[#FF522D] hover:text-[#ff6b4d] transition-colors">
            Volver al detalle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black relative"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(prev => !prev)}
    >
      {/* Header minimalista */}
      {showControls && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-medium text-zinc-300">{comic.title}</h1>
              <p className="text-xs text-zinc-500">
                {readingMode === "page" ? `${currentPage + 1} / ${totalPages}` : `${totalPages} páginas`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Botón para cambiar modo de lectura */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setReadingMode(prev => prev === "page" ? "cascade" : "page");
                }}
                className="text-zinc-400 hover:text-zinc-200 transition-colors p-2"
                title={readingMode === "page" ? "Cambiar a modo cascada" : "Cambiar a modo página"}
              >
                {readingMode === "page" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </button>
              <Link
                to={`/comic/${id}`}
                className="text-zinc-400 hover:text-zinc-200 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Controles laterales - Solo en modo página */}
      {readingMode === "page" && (
        <>
          <div className="fixed inset-y-0 left-0 z-40 flex items-center px-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevPage();
              }}
              disabled={currentPage === 0}
              className="bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-r-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="fixed inset-y-0 right-0 z-40 flex items-center px-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextPage();
              }}
              disabled={currentPage === totalPages - 1}
              className="bg-black/60 hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-l-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Vista según el modo */}
      {readingMode === "page" ? (
        /* Modo página por página */
        <div className="flex justify-center items-center min-h-screen py-4">
          <div className="w-full max-w-6xl px-4 relative">
            {imageLoading && (
              <div className="flex items-center justify-center h-screen">
                <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={currentImage}
              alt={`Página ${currentPage + 1}`}
              className={`${imageLoading ? 'hidden' : 'block'} w-full h-auto mx-auto select-none`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              draggable={false}
            />
          </div>
        </div>
      ) : (
        /* Modo cascada - todas las páginas en scroll vertical */
        <div className="pt-16 pb-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-2">
              {comic.pages.map((page, index) => (
                <div key={index} className="w-full">
                  <img
                    src={page}
                    alt={`Página ${index + 1}`}
                    className="w-full h-auto mx-auto select-none"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controles inferiores - Solo en modo página */}
      {showControls && readingMode === "page" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <input
              type="range"
              min="0"
              max={totalPages - 1}
              value={currentPage}
              onChange={(e) => {
                setCurrentPage(parseInt(e.target.value));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#FF522D]"
            />
            <p className="text-xs text-zinc-500 text-center mt-2">
              Usa las flechas ← → para navegar o toca para ocultar controles
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
