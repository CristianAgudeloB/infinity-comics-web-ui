import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getSeries, searchSeries, getTopSeries } from "../api/series.api";
import { getRecentComics, searchComics } from "../api/comics.api";
import type { Series } from "../types/series";
import type { Comic } from "../types/comic";
import SeriesCard from "../components/SeriesCard";
import ComicCard from "../components/ComicCard";
import SeriesSlider from "../components/SeriesSlider";
import ComicsSlider from "../components/ComicsSlider";
import Pagination from "../components/Pagination";

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  const [series, setSeries] = useState<Series[]>([]);
  const [featuredComics, setFeaturedComics] = useState<Comic[]>([]);
  const [recentComics, setRecentComics] = useState<Comic[]>([]);
  const [topSeries, setTopSeries] = useState<Series[]>([]);
  const [searchResults, setSearchResults] = useState<{ series: Series[]; comics: Comic[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    document.title = searchQuery 
      ? `Búsqueda: "${searchQuery}" - Infinity Comics`
      : "Infinity Comics";
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
          setFeaturedComics([]);
          setRecentComics([]);
          setTopSeries([]); // También limpiar topSeries en búsqueda
          setCurrentPage(1); // Resetear a página 1 en nueva búsqueda
        } else {
          const [allSeries, recent, top] = await Promise.all([
            getSeries().catch(() => []),
            getRecentComics(10).catch(() => []),
            getTopSeries(10).catch(() => [])
          ]);
          setSeries(allSeries);
          setFeaturedComics([]);
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

  // Agrupar series por editorial y filtrar solo las editoriales principales
  const seriesByPublisher = useMemo(() => {
    // Editoriales permitidas en la página principal
    const allowedPublishers = ['Marvel', 'DC', 'Image', 'Indie', 'Manga'];
    
    const grouped = series.reduce((acc, s) => {
      const pub = s.publisher || '';
      // Normalizar el nombre de la editorial para comparación
      let normalizedPublisher = pub;
      
      // Mapear variaciones a los nombres principales
      if (pub.toLowerCase().includes('marvel')) {
        normalizedPublisher = 'Marvel';
      } else if (pub.toLowerCase().includes('dc') || pub.toLowerCase().includes('detective comics')) {
        normalizedPublisher = 'DC';
      } else if (pub.toLowerCase().includes('image')) {
        normalizedPublisher = 'Image';
      } else if (pub.toLowerCase().includes('manga') || pub.toLowerCase().includes('shonen') || pub.toLowerCase().includes('viz')) {
        normalizedPublisher = 'Manga';
      } else if (!pub.toLowerCase().includes('marvel') && 
                 !pub.toLowerCase().includes('dc') && 
                 !pub.toLowerCase().includes('detective') && 
                 !pub.toLowerCase().includes('manga') &&
                 !pub.toLowerCase().includes('image')) {
        // Todo lo demás va a Indie
        normalizedPublisher = 'Indie';
      }
      
      // Solo incluir si está en las editoriales permitidas
      if (allowedPublishers.includes(normalizedPublisher)) {
        if (!acc[normalizedPublisher]) {
          acc[normalizedPublisher] = [];
        }
        acc[normalizedPublisher].push(s);
      }
      
      return acc;
    }, {} as Record<string, Series[]>);

    // Aleatorizar series por editorial basado en la hora actual
    const currentHour = new Date().getHours();
    Object.keys(grouped).forEach(publisher => {
      // Usar la hora como semilla para la aleatorización
      const shuffled = [...grouped[publisher]];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (currentHour + i) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      grouped[publisher] = shuffled;
    });

    // Ordenar las editoriales en el orden especificado
    const orderedPublishers: Record<string, Series[]> = {};
    allowedPublishers.forEach(pub => {
      if (grouped[pub]) {
        orderedPublishers[pub] = grouped[pub];
      }
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

  // Vista de búsqueda
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
          <p className="text-zinc-400">
            {allResults.length} resultados encontrados
          </p>
        </div>

        {paginatedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {paginatedResults.map((item) => {
                if ('name' in item) {
                  // Es una serie
                  return <SeriesCard key={item._id} id={item._id} title={item.name} image={item.coverUrl} publisher={item.publisher} optimizeImage={true} hasOnlineRead={item.hasOnlineRead} />;
                } else {
                  // Es un cómic
                  return <ComicCard key={item._id} comic={item} optimizeImage={true} />;
                }
              })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No se encontraron resultados para "{searchQuery}"</p>
          </div>
        )}
      </div>
    );
  }

  // Mapear editoriales comunes
  const getPublisherSlug = (publisher: string): string => {
    if (publisher === "Marvel") return "/marvel";
    if (publisher === "DC") return "/dc";
    if (publisher === "Image") return "/image";
    if (publisher === "Indie") return "/indie";
    if (publisher === "Manga") return "/manga";
    return `/editorial/${encodeURIComponent(publisher)}`;
  };

  // Vista principal
  return (
    <div className="space-y-8">
      {/* Destacados como Slider */}
      {topSeries.length > 0 && (
        <SeriesSlider
          title="Destacados"
          subtitle="Las series más leídas"
          series={topSeries}
          maxItems={10}
          showViewMore={false}
          viewMoreLink=""
        />
      )}

      {/* Novedades */}
      {recentComics.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-100">Novedades</h2>
            <Link
              to="/novedades"
              className="text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors font-medium"
            >
              Ver más →
            </Link>
          </div>
          <ComicsSlider title="" comics={recentComics} maxItems={10} />
        </section>
      )}

      {/* Sliders por Editorial */}
      {Object.entries(seriesByPublisher).map(([publisher, publisherSeries]) => (
        <SeriesSlider
          key={publisher}
          title={publisher}
          series={publisherSeries}
          viewMoreLink={getPublisherSlug(publisher)}
          maxItems={10}
        />
      ))}

      {series.length === 0 && recentComics.length === 0 && topSeries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No hay contenido disponible en este momento</p>
        </div>
      )}
    </div>
  );
}