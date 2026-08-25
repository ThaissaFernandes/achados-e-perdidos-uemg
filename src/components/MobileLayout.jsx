import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Search } from 'lucide-react';

export default function MobileLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-indigo-600 font-bold' : 'text-gray-500';

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-0 sm:p-4">
      {/* Moldura que simula o Smartphone no Desktop */}
      <div className="w-full max-w-md bg-white min-h-[100svh] sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border border-gray-300 relative">
        
        {/* Top Bar / Header */}
        <header className="bg-indigo-900 text-white p-4 shadow-md flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-lg font-bold tracking-tight">FindIT</h1>
            <p className="text-xs text-indigo-200">UEMG — Divinópolis</p>
          </div>
        </header>

        {/* Área de Conteúdo Dinâmico (Páginas) */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>

        {/* Bottom Navigation (Heurística de Consistência e Padrões) */}
        <nav className="bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center shrink-0 shadow-lg">
          <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
            <Home size={22} />
            <span className="text-[10px]">Início</span>
          </Link>
          <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search')}`}>
            <Search size={22} />
            <span className="text-[10px]">Buscar</span>
          </Link>
          <Link to="/register" className={`flex flex-col items-center gap-1 ${isActive('/register')}`}>
            <PlusCircle size={22} className="text-indigo-600" />
            <span className="text-[10px]">Cadastrar</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
            <User size={22} />
            <span className="text-[10px]">Perfil</span>
          </Link>
        </nav>

      </div>
    </div>
  );
}