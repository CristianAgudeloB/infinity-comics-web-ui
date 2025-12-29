import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getSeries, searchSeries, getTopSeries } from "../api/series.api";
import { getRecentComics, searchComics } from "../api/comics.api";
import type { Series } from "../types/series";
import type { Comic } from "../types/comic";
import SeriesCard from "../components/SeriesCard";
import ComicCard from "../components/ComicCard";
import SeriesSlider from "../components/SeriesSlider";
import Pagination from "../components/Pagination";
import { FireIcon, ClockIcon, BoltIcon } from "../components/Icons";

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [series, setSeries] = useState<Series[]>([]);
  const [recentComics, setRecentComics] = useState<Comic[]>([]);
  const [topSeries, setTopSeries] = useState<Series[]>([]);
  const [searchResults, setSearchResults] = useState<{ series: Series[]; comics: Comic[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    document.title = searchQuery ? `Búsqueda: "${searchQuery}" - Infinity Comics` : "Infinity Comics";
  }, [searchQuery]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const [seriesResults, comicsResults] = await Promise.all([
            searchSeries(searchQuery).catch(() => []),
            searchComics(searchQuery).catch(() => [])
          ]);
          setSearchResults({ series: seriesResults, comics: comicsResults });
          setSeries([]);
          setRecentComics([]);
          setTopSeries([]);
          setCurrentPage(1);
        } else {
          const [allSeries, recent, top] = await Promise.all([
            getSeries().catch(() => []),
            getRecentComics(10).catch(() => []),
            getTopSeries(10).catch(() => [])
          ]);
          setSeries(allSeries);
          setRecentComics(recent);
          setTopSeries(top);
          setSearchResults(null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [searchQuery]);

  // Mapa de series por ID para buscar editoriales rápidamente
  const seriesMap = useMemo(() => {
    const map = new Map<string, Series>();
    series.forEach(s => map.set(s._id, s));
    return map;
  }, [series]);

  const seriesByPublisher = useMemo(() => {
    const allowedPublishers = ['Marvel', 'DC', 'Image', 'Indie', 'Manga'];
    const grouped = series.reduce((acc, s) => {
      const pub = (s.publisher || '').toString();
      let normalizedPublisher = pub;
      const lower = pub.toLowerCase();
      if (lower.includes('marvel')) normalizedPublisher = 'Marvel';
      else if (lower.includes('dc') || lower.includes('detective comics')) normalizedPublisher = 'DC';
      else if (lower.includes('image')) normalizedPublisher = 'Image';
      else if (lower.includes('manga') || lower.includes('shonen') || lower.includes('viz')) normalizedPublisher = 'Manga';
      else if (!lower.includes('marvel') && !lower.includes('dc') && !lower.includes('detective') && !lower.includes('manga') && !lower.includes('image')) normalizedPublisher = 'Indie';
      if (allowedPublishers.includes(normalizedPublisher)) {
        if (!acc[normalizedPublisher]) acc[normalizedPublisher] = [];
        acc[normalizedPublisher].push(s);
      }
      return acc;
    }, {} as Record<string, Series[]>);

    const currentHour = new Date().getHours();
    Object.keys(grouped).forEach(publisher => {
      const shuffled = [...grouped[publisher]];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (currentHour + i) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      grouped[publisher] = shuffled;
    });

    const orderedPublishers: Record<string, Series[]> = {};
    ['Marvel', 'DC', 'Image', 'Indie', 'Manga'].forEach(pub => {
      if (grouped[pub]) orderedPublishers[pub] = grouped[pub];
    });

    return orderedPublishers;
  }, [series]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#FF522D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (searchQuery && searchResults) {
    const allResults = [...searchResults.series, ...searchResults.comics];
    const totalPages = Math.ceil(allResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 mb-2">
            Resultados de búsqueda: <span className="text-[#FF522D]">"{searchQuery}"</span>
          </h1>
          <p className="text-zinc-400">{allResults.length} resultados encontrados</p>
        </div>

        {paginatedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedResults.map((item) => {
                if ('name' in item) {
                  return <SeriesCard key={item._id} id={item._id} title={item.name} image={item.coverUrl} publisher={item.publisher} optimizeImage={true} hasOnlineRead={item.hasOnlineRead} />;
                } else {
                  return <ComicCard key={item._id} comic={item} optimizeImage={true} />;
                }
              })}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No se encontraron resultados para "{searchQuery}"</p>
          </div>
        )}
      </div>
    );
  }

  const getPublisherSlug = (publisher: string): string => {
    const map: Record<string, string> = {
      "Marvel": "/marvel",
      "DC": "/dc", 
      "Image": "/image",
      "Indie": "/indie",
      "Manga": "/manga"
    };
    return map[publisher] || `/editorial/${encodeURIComponent(publisher)}`;
  };

// Renderizar sección de editorial con grid (para Marvel y DC)
const renderPublisherGridSection = (publisher: string, publisherSeries: Series[]) => {
  // Limitar a 5 elementos para mostrar en una sola fila
  const limitedSeries = publisherSeries.slice(0, 5);
  
  return (
    <section key={publisher} className="w-full mb-6 sm:mb-8 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">{publisher}</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Explora la colección de {publisher}</p>
        </div>
        <Link 
          to={getPublisherSlug(publisher)} 
          className="flex items-center gap-2 text-xs sm:text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium group self-start sm:self-auto"
        >
          Ver todo
          <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grid de series - 5 columnas, tamaño similar a los sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {limitedSeries.map((s) => (
          <SeriesCard 
            key={s._id} 
            id={s._id} 
            title={s.name} 
            image={s.coverUrl} 
            publisher={s.publisher} 
            optimizeImage={true} 
            hasOnlineRead={s.hasOnlineRead} 
          />
        ))}
      </div>
    </section>
  );
};

// Renderizar sección de editorial con slider (para Image, Indie, Manga)
const renderPublisherSection = (publisher: string, publisherSeries: Series[]) => {
  // Limitar a 12 elementos máximo para el slider
  const limitedSeries = publisherSeries.slice(0, 12);
  
  return (
    <section key={publisher} className="w-full mb-8 sm:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">{publisher}</h2>
          <p className="text-xs sm:text-sm text-zinc-400">Explora la colección de {publisher}</p>
        </div>
        <Link 
          to={getPublisherSlug(publisher)} 
          className="flex items-center gap-2 text-xs sm:text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium group self-start sm:self-auto"
        >
          Ver todo
          <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Contenedor del slider - asegurar ancho completo y scroll correcto */}
      <div className="w-full min-w-0">
        <SeriesSlider 
          series={limitedSeries} 
          viewMoreLink={getPublisherSlug(publisher)}
          showViewMore={false}
        />
      </div>
    </section>
  );
};

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Sección principal con contenido destacado */}
      <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
        {/* Contenido principal - Ocupa todo el ancho en móvil, 2/3 en desktop */}
        <div className="flex-1 w-full min-w-0 flex flex-col">
          {/* Sección de Novedades con Marvel y DC integrados */}
          <div className="space-y-8 md:space-y-10 flex-1">
            {/* Novedades */}
            {recentComics.length > 0 && (
              <section className="bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-zinc-900/40 border border-zinc-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl hover:shadow-[#FF522D]/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-zinc-800/60 to-zinc-800/40 border border-zinc-700/50 rounded-lg shadow-sm">
                      <BoltIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-zinc-100 bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                        Novedades
                      </h2>
                      <p className="text-sm text-zinc-400">Recién llegados a la colección</p>
                    </div>
                  </div>
                  <Link 
                    to="/novedades" 
                    className="flex items-center gap-2 text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium group"
                  >
                    Ver todos
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {recentComics.slice(0, 6).map((comic) => {
                    const comicSeries = comic.seriesId ? seriesMap.get(comic.seriesId) : null;
                    const publisher = comicSeries?.publisher || '';
                    
                    return (
                      <Link 
                        key={comic._id} 
                        to={`/comic/${comic._id}`} 
                        className="flex gap-3 sm:gap-4 p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-[#FF522D]/30 transition-all duration-200 group"
                      >
                        <div className="relative flex-shrink-0 aspect-[17/26] w-16 sm:w-20 rounded overflow-hidden bg-zinc-800">
                          <img 
                            src={comic.coverUrl} 
                            alt={comic.title} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" 
                          />
                          <div className="absolute top-1 left-1 bg-[#FF522D] text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            NUEVO
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-zinc-100 line-clamp-2 mb-1 group-hover:text-[#FF522D] transition-colors">
                            {comic.title}
                          </h3>
                          {publisher && (
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                              {publisher}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Secciones de Marvel y DC - Directamente bajo Novedades con Grid */}
            {seriesByPublisher['Marvel'] && seriesByPublisher['Marvel'].length > 0 && (
              renderPublisherGridSection('Marvel', seriesByPublisher['Marvel'])
            )}
            
            {seriesByPublisher['DC'] && seriesByPublisher['DC'].length > 0 && (
              renderPublisherGridSection('DC', seriesByPublisher['DC'])
            )}
          </div>
        </div>

        {/* Sidebar de destacados - Se oculta en móvil, aparece en desktop, alineado con el contenido */}
        {topSeries.length > 0 && (
          <aside className="lg:w-80 lg:flex-shrink-0 w-full flex flex-col">
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 sm:p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="p-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg">
                  <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100">Destacados</h3>
              </div>

              <div className="space-y-2 sm:space-y-3 flex-1">
                {topSeries.slice(0, 10).map((seriesItem, index) => (
                  <Link 
                    key={seriesItem._id} 
                    to={`/series/${seriesItem._id}`} 
                    className="flex gap-2 sm:gap-3 group"
                  >
                    <div className="relative flex-shrink-0 w-14 h-20 sm:w-16 sm:h-24 rounded overflow-hidden bg-zinc-800">
                      <img 
                        src={seriesItem.coverUrl} 
                        alt={seriesItem.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 line-clamp-2 mb-1 group-hover:text-[#FF522D] transition-colors">
                        {seriesItem.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mb-1 line-clamp-1">{seriesItem.publisher}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#FF522D] font-semibold">#{index + 1}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Otras editoriales (Image, Indie, Manga) */}
      {Object.entries(seriesByPublisher)
        .filter(([publisher]) => publisher !== 'Marvel' && publisher !== 'DC')
        .map(([publisher, publisherSeries]) => renderPublisherSection(publisher, publisherSeries))}

      {/* Estado vacío */}
      {series.length === 0 && recentComics.length === 0 && topSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No hay contenido disponible en este momento</p>
        </div>
      )}
    </div>
  );
}