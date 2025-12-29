import { Link } from "react-router-dom";
import { incrementSeriesViews } from "../api/series.api";

interface Props {
  id: string;
  title: string;
  image: string;
  publisher?: string;
  optimizeImage?: boolean;
  hasOnlineRead?: boolean;
}

export default function SeriesCard({ id, title, image, publisher, optimizeImage = false, hasOnlineRead = false }: Props) {
  const handleClick = () => {
    // Incrementar views de forma asíncrona sin bloquear la navegación
    incrementSeriesViews(id).catch(() => {
      // Silenciar errores para no interrumpir la experiencia del usuario
    });
  };

  // Optimizar imagen para thumbnails
  const imageUrl = optimizeImage && image.includes('imgur.com') 
    ? image.replace(/\.(jpeg|jpg|png)$/i, 'm.$1') // imgur soporta 'm' para medium
    : image;

  return (
    <Link
      to={`/series/${id}`}
      onClick={handleClick}
      className="group text-left block"
    >
      <div className="relative aspect-[17/26] rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800/50 group-hover:border-[#FF522D]/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-[#FF522D]/10">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {hasOnlineRead && (
          <div className="absolute top-2 right-2 bg-[#FF522D] text-white text-xs px-2 py-1 rounded-full font-semibold">
            Leer Online
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-zinc-200 group-hover:text-[#FF522D] transition-colors line-clamp-2">
        {title}
      </h3>
      {publisher && (
        <p className="mt-1 text-xs text-zinc-500">{publisher}</p>
      )}
    </Link>
  );
}