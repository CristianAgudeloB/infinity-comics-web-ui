import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Series } from "../types/series";
import SeriesCard from "./SeriesCard";

interface Props {
  series: Series[];
  viewMoreLink: string;
  showViewMore?: boolean;
  title?: string;
}

export default function SeriesSlider({ 
  series, 
  viewMoreLink, 
  showViewMore = true,
  title
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  if (series.length === 0) return null;

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
    
    setTimeout(checkScroll, 300);
  };

  useEffect(() => {
    checkScroll();
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [series]);

  return (
    <div className="w-full">
      {/* Header solo si hay título */}
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-zinc-100">{title}</h3>
          {showViewMore && (
            <Link 
              to={viewMoreLink} 
              className="text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium"
            >
              Ver más →
            </Link>
          )}
        </div>
      )}

      {/* Contenedor del slider */}
      <div className="relative w-full">
        {/* Flecha izquierda */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full p-3 shadow-lg transition-all hidden sm:block"
            aria-label="Deslizar izquierda"
          >
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Contenido del slider */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {series.map((s) => (
            <div 
              key={s._id} 
              className="flex-shrink-0 w-40 sm:w-48 md:w-52 lg:w-56 snap-start"
            >
              <SeriesCard 
                id={s._id} 
                title={s.name} 
                image={s.coverUrl} 
                publisher={s.publisher} 
                optimizeImage={true} 
                hasOnlineRead={s.hasOnlineRead} 
              />
            </div>
          ))}
        </div>

        {/* Flecha derecha */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full p-3 shadow-lg transition-all hidden sm:block"
            aria-label="Deslizar derecha"
          >
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Indicadores de scroll para móvil */}
      <div className="flex justify-center gap-2 mt-4 sm:hidden">
        {Array.from({ length: Math.min(5, series.length) }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!scrollContainerRef.current) return;
              const container = scrollContainerRef.current;
              const scrollAmount = container.clientWidth * i;
              container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
            }}
            className="w-2 h-2 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors"
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}