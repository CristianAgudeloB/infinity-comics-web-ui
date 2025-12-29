import { useEffect, useState } from "react";
import { getRecentComics } from "../api/comics.api";
import type { Comic } from "../types/comic";
import ComicCard from "../components/ComicCard";

export default function RecentComicsPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComics = async () => {
      setLoading(true);
      try {
        const recent = await getRecentComics(100).catch(() => []);
        setComics(recent);
      } catch (error) {
        console.error("Error loading comics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComics();
  }, []);

  useEffect(() => {
    document.title = "Novedades - Infinity Comics";
  }, []);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2">Novedades</h1>
        <p className="text-zinc-400">
          Últimos {comics.length} cómics añadidos
        </p>
      </div>

      {comics.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {comics.map((c) => (
            <ComicCard key={c._id} comic={c} optimizeImage={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No hay cómics disponibles</p>
        </div>
      )}
    </div>
  );
}

