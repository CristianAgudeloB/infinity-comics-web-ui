import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HomeIcon, SparklesIcon, UsersIcon } from "./Icons";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <img src="/logo.png" alt="Infinity Comics" className="h-10 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
            <Link to="/" className="flex items-center gap-2 hover:text-[#FF522D] transition-colors group">
              <HomeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Inicio
            </Link>
            <Link to="/novedades" className="flex items-center gap-2 hover:text-[#FF522D] transition-colors group">
              <SparklesIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Novedades
            </Link>
            <Link to="/el-corps" className="flex items-center gap-2 hover:text-[#FF522D] transition-colors group">
              <UsersIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              El Corps
            </Link>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
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

          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50 transition-colors group"
            >
              <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Inicio</span>
            </Link>
            <Link
              to="/novedades"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50 transition-colors group"
            >
              <SparklesIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Novedades</span>
            </Link>
            <Link
              to="/el-corps"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-300 hover:text-[#FF522D] hover:bg-zinc-800/50 transition-colors group"
            >
              <UsersIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">El Corps</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
