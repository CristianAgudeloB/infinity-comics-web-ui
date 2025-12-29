import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-zinc-900/50 border-t border-zinc-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Link
            to="/el-corps"
            className="text-sm text-[#FF522D] hover:text-[#ff6b4d] transition-colors"
          >
            El Corps
          </Link>
        </div>
        <p className="text-center text-sm text-zinc-400">
          Infinity Comics 2026 - Sin ánimo de lucro. Todos los derechos reservados a sus respectivos creadores y propietarios.
        </p>
        <p className="text-center text-xs text-zinc-500 mt-2">
          Web desarrollada por Absolute
        </p>
      </div>
    </footer>
  );
}

