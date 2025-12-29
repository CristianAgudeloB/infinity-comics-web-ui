import { useRef } from "react";
import type { Comic } from "../types/comic";
import ComicCard from "./ComicCard";

interface Props {
  title: string;
  comics: Comic[];
  maxItems?: number;
}

export default function ComicsSlider({ title, comics, maxItems = 10 }: Props) {
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

  const displayComics = comics.slice(0, maxItems);

  if (displayComics.length === 0) return null;

  return (
    <section className="mb-12">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">{title}</h2>
        </div>
      )}

      <div className="relative">
        {/* Botón izquierdo */}
        {displayComics.length > 6 && (
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
          {[...displayComics, ...displayComics, ...displayComics].map((c, index) => (
            <div key={`${c._id}-${index}`} className="flex-shrink-0 w-32 sm:w-40 md:w-44">
              <ComicCard comic={c} optimizeImage={true} />
            </div>
          ))}
        </div>

        {/* Botón derecho */}
        {displayComics.length > 6 && (
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

