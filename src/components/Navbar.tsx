import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Infinity Comics" className="h-10 w-auto" />
        </Link>

        {/* Menú */}
        <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
          <Link to="/" className="hover:text-[#FF522D] transition-colors">
            Inicio
          </Link>
          <Link to="/novedades" className="hover:text-[#FF522D] transition-colors">
            Novedades
          </Link>
          <Link to="/el-corps" className="hover:text-[#FF522D] transition-colors">
            El Corps
          </Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cómic o serie..."
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 pl-10 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF522D]/50 focus:border-[#FF522D]/50 transition-all"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>
      </div>
    </header>
  );
}