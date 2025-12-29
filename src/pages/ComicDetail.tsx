import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getComicById, getAllComics } from "../api/comics.api";
import { getSeriesById, getComicsBySeries, incrementSeriesViews } from "../api/series.api";
import type { Comic } from "../types/comic";
import type { Series } from "../types/series";
import ComicCard from "../components/ComicCard";

export default function ComicDetail() {
  const { id } = useParams();
  const [comic, setComic] = useState<Comic | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [relatedComics, setRelatedComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    const loadData = async () => {
      try {
        const comicData = await getComicById(id);
        setComic(comicData);
        
        if (comicData.seriesId) {
          // Incrementar views de la serie cuando se ve un cómic
          incrementSeriesViews(comicData.seriesId).catch(() => {});
          
          const [seriesData, comicsData] = await Promise.all([
            getSeriesById(comicData.seriesId).catch(() => null),
            getComicsBySeries(comicData.seriesId).catch(() => [])
          ]);
          setSeries(seriesData);
          
          // Obtener cómics relacionados de múltiples fuentes
          const related: Comic[] = [];
          
          // 1. Cómics de la misma serie (excluyendo el actual) - prioridad alta
          const sameSeries = comicsData.filter(c => c._id !== id).slice(0, 3);
          related.push(...sameSeries);
          
          // 2. Si no hay suficientes, buscar más cómics de la misma serie
          if (related.length < 6) {
            const moreFromSeries = comicsData
              .filter(c => c._id !== id && !related.find(r => r._id === c._id))
              .slice(0, 6 - related.length);
            related.push(...moreFromSeries);
          }
          
          // 3. Si aún no hay suficientes, buscar cómics con títulos similares
          if (related.length < 6 && seriesData) {
            // Obtener todos los cómics para buscar similares
            const allComics = await getAllComics().catch(() => []);
            const comicTitleWords = comicData.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            
            const similarTitles = allComics
              .filter(c => {
                if (c._id === id || related.find(r => r._id === c._id)) return false;
                const titleLower = c.title.toLowerCase();
                return comicTitleWords.some(word => titleLower.includes(word));
              })
              .slice(0, 6 - related.length);
            related.push(...similarTitles);
          }
          
          // Eliminar duplicados y limitar a 6
          const uniqueRelated = Array.from(
            new Map(related.map(c => [c._id, c])).values()
          ).slice(0, 6);
          
          setRelatedComics(uniqueRelated);
        }
      } catch (error) {
        console.error("Error loading comic:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (comic) {
      document.title = `${comic.title} - Infinity Comics`;
    } else {
      document.title = "Cómic - Infinity Comics";
    }
  }, [comic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Cargando cómic...</p>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 text-lg mb-4">Cómic no encontrado</p>
        <Link to="/" className="text-[#FF522D] hover:text-[#ff6b4d] transition-colors">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header del Cómic */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="flex-shrink-0">
          <div className="relative aspect-[17/26] w-48 md:w-64 rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 shadow-xl">
            <img
              src={comic.coverUrl}
              alt={comic.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            {comic.title}
          </h1>
          
          {series && (
            <div className="mb-4">
              <Link
                to={`/series/${series._id}`}
                className="text-[#FF522D] hover:text-[#ff6b4d] transition-colors text-lg"
              >
                {series.name}
              </Link>
              <span className="text-zinc-500 mx-2">•</span>
              <span className="text-zinc-400">{series.publisher}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-4 mb-6">
            {comic.onlineRead && comic.pages.length > 0 && (
              <Link
                to={`/comic/${comic._id}/read`}
                className="inline-flex items-center gap-2 bg-[#FF522D] hover:bg-[#ff3d1a] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Leer Online
              </Link>
            )}
          </div>

          {/* Enlaces de descarga */}
          {comic.downloadUrls && comic.downloadUrls.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-zinc-200 mb-3">Enlaces de descarga</h3>
              <div className="flex flex-wrap gap-2">
                {comic.downloadUrls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Opción {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Información adicional */}
          <div className="space-y-2 text-sm text-zinc-400">
            {comic.onlineRead && (
              <div className="flex items-center gap-2">
                <span className="text-[#FF522D]">✓</span>
                <span>Disponible para lectura online ({comic.pages.length} páginas)</span>
              </div>
            )}
            {comic.downloadUrls && comic.downloadUrls.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[#FF522D]">✓</span>
                <span>{comic.downloadUrls.length} enlace{comic.downloadUrls.length > 1 ? 's' : ''} de descarga disponible{comic.downloadUrls.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cómics relacionados */}
      {relatedComics.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">Cómics relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {relatedComics.map((c) => (
              <ComicCard key={c._id} comic={c} optimizeImage={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

