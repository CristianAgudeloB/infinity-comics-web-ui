import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Series } from "../types/series";
import SeriesCard from "./SeriesCard";

interface Props {
  title: string;
  series: Series[];
  viewMoreLink: string;
  maxItems?: number;
  showViewMore?: boolean;
  subtitle?: string;
}

export default function SeriesSlider({ 
  title, 
  series, 
  viewMoreLink, 
  maxItems = 10,
  showViewMore = true,
  subtitle
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const displaySeries = series.slice(0, maxItems);

  if (displaySeries.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
          {subtitle && (
            <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
          )}
        </div>
        {/* Solo mostrar "Ver más" si showViewMore es true */}
        {showViewMore && (
          <Link
            to={viewMoreLink}
            className="text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium"
          >
            Ver más →
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Botón izquierdo */}
        {displaySeries.length > 6 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full p-2 shadow-lg transition-all"
            aria-label="Deslizar izquierda"
          >
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Contenedor con scroll horizontal infinito */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {/* Duplicar elementos para efecto infinito */}
          {[...displaySeries, ...displaySeries, ...displaySeries].map((s, index) => (
            <div key={`${s._id}-${index}`} className="flex-shrink-0 w-32 sm:w-40 md:w-44">
              <SeriesCard id={s._id} title={s.name} image={s.coverUrl} publisher={s.publisher} optimizeImage={true} hasOnlineRead={s.hasOnlineRead} />
            </div>
          ))}
        </div>

        {/* Botón derecho */}
        {displaySeries.length > 6 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 rounded-full p-2 shadow-lg transition-all"
            aria-label="Deslizar derecha"
          >
            <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}