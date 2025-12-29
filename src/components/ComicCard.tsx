import { Link } from "react-router-dom";
import type { Comic } from "../types/comic";

interface Props {
  comic: Comic;
  showSeries?: boolean;
  optimizeImage?: boolean;
}

export default function ComicCard({ comic, showSeries = false, optimizeImage = false }: Props) {
  // Optimizar imagen para thumbnails
  const imageUrl = optimizeImage && comic.coverUrl.includes('imgur.com') 
    ? comic.coverUrl.replace(/\.(jpeg|jpg|png)$/i, 'm.$1') // imgur soporta 'm' para medium
    : comic.coverUrl;

  return (
    <Link
      to={`/comic/${comic._id}`}
      className="group block"
    >
      <div className="relative aspect-[17/26] rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 group-hover:border-[#FF522D]/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#FF522D]/10">
        <img
          src={imageUrl}
          alt={comic.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {comic.onlineRead && (
          <div className="absolute top-2 right-2 bg-[#FF522D] text-white text-xs px-2 py-1 rounded-full font-semibold">
            Leer Online
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-200 group-hover:text-[#FF522D] transition-colors line-clamp-2">
        {comic.title}
      </h3>
    </Link>
  );
}