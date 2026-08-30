import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Search } from 'lucide-react';

export default function MobileLayout() {
  const location = useLocation();

  // Helper para aplicar estilo ativo/inativo nos botões de navegação
  const isActive = (path) =>
    location.pathname === path
      ? 'text-indigo-600 font-bold'
      : 'text-gray-500 hover:text-gray-700';

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-0 sm:p-4">
      {/* Moldura que simula o Smartphone no Desktop */}
      <div className="w-full max-w-md bg-white min-h-[100svh] sm:min-h-[844px] sm:max-h-[844px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border border-gray-300 relative">
        
        {/* Top Bar / Header */}
        <header className="bg-indigo-900 text-white p-4 shadow-md flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Achados e Perdidos UEMG</h1>
            <p className="text-xs text-indigo-200">UEMG — Divinópolis</p>
          </div>
        </header>

        {/* Área de Conteúdo Dinâmico (Páginas) */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 scroll-smooth">
          <Outlet />
        </main>

        {/* Bottom Navigation (Heurística de Consistência e Padrões) */}
        <nav className="bg-white border-t border-gray-200 px-6 py-2.5 flex justify-between items-center shrink-0 shadow-lg">
          
          {/* Início */}
          <Link
            to="/"
            aria-label="Ir para a página inicial"
            className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${isActive('/')}`}
          >
            <Home size={22} />
            <span className="text-[10px]">Início</span>
          </Link>

          {/* Buscar */}
          <Link
            to="/search"
            aria-label="Buscar objetos"
            className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${isActive('/search')}`}
          >
            <Search size={22} />
            <span className="text-[10px]">Buscar</span>
          </Link>

          {/* Cadastrar */}
          <Link
            to="/register"
            aria-label="Cadastrar novo item"
            className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${isActive('/register')}`}
          >
            <PlusCircle
              size={22}
              className={location.pathname === '/register' ? 'text-indigo-600' : 'text-indigo-500'}
            />
            <span className="text-[10px]">Cadastrar</span>
          </Link>

          {/* Perfil */}
          <Link
            to="/profile"
            aria-label="Ir para o perfil do usuário"
            className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${isActive('/profile')}`}
          >
            <User size={22} />
            <span className="text-[10px]">Perfil</span>
          </Link>

        </nav>

      </div>
    </div>
  );
}