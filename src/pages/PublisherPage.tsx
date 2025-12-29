import { useEffect, useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getSeries } from "../api/series.api";
import type { Series } from "../types/series";
import SeriesCard from "../components/SeriesCard";
import Pagination from "../components/Pagination";

const publisherMap: Record<string, string> = {
  marvel: "Marvel",
  dc: "DC",
  image: "Image",
  indie: "Indie",
  manga: "Manga"
};

type SortOption = "name-asc" | "name-desc" | "recent" | "oldest";

export default function PublisherPage() {
  const { publisher: publisherParam } = useParams<{ publisher?: string }>();
  const location = useLocation();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Obtener el nombre de la editorial para mostrar
  const getPublisherDisplayName = useMemo(() => {
    let publisherSlug: string | undefined;
    
    if (publisherParam) {
      publisherSlug = publisherParam;
    } else {
      const pathname = location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        publisherSlug = segments[0];
      }
    }
    
    if (!publisherSlug) return "Editorial";
    return publisherMap[publisherSlug.toLowerCase()] || decodeURIComponent(publisherSlug);
  }, [publisherParam, location.pathname]);

  useEffect(() => {
    // Obtener el slug de la URL
    let publisherSlug: string | undefined;
    
    // Si hay parámetro (ruta /editorial/:publisher), usarlo
    if (publisherParam) {
      publisherSlug = publisherParam;
    } else {
      // Si no hay parámetro, extraer de la ruta (ej: /marvel, /dc)
      const pathname = location.pathname;
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        publisherSlug = segments[0];
      }
    }
    
    if (!publisherSlug) {
      setLoading(false);
      return;
    }
    
    const loadSeries = async () => {
      setLoading(true);
      try {
        const slugLower = publisherSlug.toLowerCase();
        let publisherName: string | undefined;
        
        // Mapear slug a nombre de editorial
        if (slugLower === 'marvel') {
          publisherName = 'Marvel';
        } else if (slugLower === 'dc') {
          publisherName = 'DC';
        } else if (slugLower === 'image') {
          publisherName = 'Image';
        } else if (slugLower === 'manga') {
          publisherName = 'Manga';
        } else if (slugLower === 'indie') {
          // Para indie, obtener todas y filtrar en frontend (excluyendo Image)
          const allSeries = await getSeries();
          const filtered = allSeries.filter(s => {
            const pub = (s.publisher || '').toLowerCase();
            return !pub.includes('marvel') && 
                   !pub.includes('dc') && 
                   !pub.includes('detective') && 
                   !pub.includes('manga') &&
                   !pub.includes('image');
          });
          setSeries(filtered);
          setLoading(false);
          return;
        } else {
          publisherName = publisherMap[slugLower] || decodeURIComponent(publisherSlug);
        }
        
        // Usar el filtro del backend directamente
        if (publisherName) {
          const filtered = await getSeries(publisherName);
          setSeries(filtered);
        } else {
          setSeries([]);
        }
      } catch (error) {
        console.error("Error loading series:", error);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, [publisherParam, location.pathname]);

  useEffect(() => {
    document.title = `${getPublisherDisplayName} - Infinity Comics`;
  }, [getPublisherDisplayName]);

  // Ordenar series según el filtro seleccionado
  const sortedSeries = useMemo(() => {
    const sorted = [...series];
    
    switch (sortBy) {
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "recent":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  }, [series, sortBy]);

  // Paginación
  const totalPages = Math.ceil(sortedSeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSeries = sortedSeries.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  const publisherName = getPublisherDisplayName;
  
  // Agrupar series por editorial cuando es Indie
  const seriesBySubPublisher = useMemo(() => {
    if (publisherName !== "Indie") return null;
    
    const grouped = sortedSeries.reduce((acc, s) => {
      const pub = s.publisher || '';
      // Excluir Image
      if (pub.toLowerCase().includes('image')) return acc;
      
      if (!acc[pub]) {
        acc[pub] = [];
      }
      acc[pub].push(s);
      return acc;
    }, {} as Record<string, Series[]>);
    
    return grouped;
  }, [sortedSeries, publisherName]);

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

  // Si es Indie, mostrar agrupado por editorial
  if (publisherName === "Indie" && seriesBySubPublisher) {
    const subPublishers = Object.keys(seriesBySubPublisher).sort();
    
    return (
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">{publisherName}</h1>
          <p className="text-zinc-400">
            Series agrupadas por editorial
          </p>
        </div>

        {subPublishers.length > 0 ? (
          subPublishers.map((subPublisher) => {
            const subPublisherSeries = seriesBySubPublisher[subPublisher];

            return (
              <div key={subPublisher} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-zinc-100">{subPublisher}</h2>
                  <p className="text-sm text-zinc-400">
                    {subPublisherSeries.length} {subPublisherSeries.length === 1 ? "serie" : "series"}
                  </p>
                </div>
                
                {subPublisherSeries.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {subPublisherSeries.map((s) => (
                      <SeriesCard key={s._id} id={s._id} title={s.name} image={s.coverUrl} publisher={s.publisher} optimizeImage={true} />
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-400 text-sm">No hay series disponibles</p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No hay series disponibles para esta editorial</p>
          </div>
        )}
      </div>
    );
  }

  // Vista normal para otras editoriales
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">{publisherName}</h1>
          <p className="text-zinc-400">
            {series.length} {series.length === 1 ? "serie encontrada" : "series encontradas"}
          </p>
        </div>
        
        {/* Filtros */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">Ordenar por:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 text-sm focus:outline-none focus:border-[#FF522D] transition-colors"
          >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguas</option>
            <option value="name-asc">A-Z</option>
            <option value="name-desc">Z-A</option>
          </select>
        </div>
      </div>

      {paginatedSeries.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {paginatedSeries.map((s) => (
              <SeriesCard key={s._id} id={s._id} title={s.name} image={s.coverUrl} publisher={s.publisher} optimizeImage={true} hasOnlineRead={s.hasOnlineRead} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No hay series disponibles para esta editorial</p>
        </div>
      )}
    </div>
  );
}
