import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicsBySeries, getSeriesById } from "../api/series.api";
import type { Series } from "../types/series";
import type { Comic } from "../types/comic";
import ComicCard from "../components/ComicCard";

export default function SeriesDetail() {
  const { id } = useParams();
  const [series, setSeries] = useState<Series | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getSeriesById(id).then(setSeries).catch((err) => {
        console.error("Error loading series:", err);
        setSeries(null);
      }),
      getComicsBySeries(id).then(setComics).catch((err) => {
        console.error("Error loading comics:", err);
        setComics([]);
      })
    ]).finally(() => setLoading(false));
  }, [id]);

  // Ordenar cómics por número extraído del título
  const sortedComics = useMemo(() => {
    // Extraer número del título (buscar patrones como #1, #2, "1", "01", etc.)
    const extractNumber = (title: string): number => {
      // Buscar patrón #número
      const hashMatch = title.match(/#(\d+)/i);
      if (hashMatch) return parseInt(hashMatch[1], 10);
      
      // Buscar número al inicio del título
      const startMatch = title.match(/^(\d+)/);
      if (startMatch) return parseInt(startMatch[1], 10);
      
      // Buscar cualquier número en el título
      const anyMatch = title.match(/(\d+)/);
      if (anyMatch) return parseInt(anyMatch[1], 10);
      
      // Si no hay número, usar un número muy alto para ponerlo al final
      return 999999;
    };
    
    return [...comics].sort((a, b) => {
      const numA = extractNumber(a.title);
      const numB = extractNumber(b.title);
      return numA - numB;
    });
  }, [comics]);


  useEffect(() => {
    if (series) {
      document.title = `${series.name} - Infinity Comics`;
    } else {
      document.title = "Serie - Infinity Comics";
    }
  }, [series]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Cargando serie...</p>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg mb-4">Serie no encontrada</p>
        <Link to="/" className="text-[#FF522D] hover:text-[#ff6b4d] transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header de la Serie */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <div className="relative aspect-[17/26] w-48 md:w-64 rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 shadow-xl">
            <img
              src={series.coverUrl}
              alt={series.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            {series.name}
          </h1>
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Editorial:</span>
              <span className="text-sm font-semibold text-[#FF522D]">{series.publisher}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Año de inicio:</span>
              <span className="text-sm font-semibold text-zinc-300">{series.startYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">Total de cómics:</span>
              <span className="text-sm font-semibold text-zinc-300">{comics.length}</span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>

      {/* Lista de Comics */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-6">
          Cómics de la Serie
        </h2>
        {sortedComics.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedComics.map((comic) => (
              <ComicCard key={comic._id} comic={comic} optimizeImage={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
            <p className="text-zinc-400">No hay cómics disponibles para esta serie</p>
          </div>
        )}
      </div>
    </div>
  );
}
