import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ItemCard from '../components/ItemCard';

// Dados simulados para estruturar a interface visual
const MOCK_ITEMS = [
  {
    id: 1,
    title: 'Garrafa Térmica Pacco Azul',
    category: 'Acessórios',
    location: 'Bloco 2 - Sala 204',
    date: '24 Ago',
    status: 'perdido',
    imageUrl: ''
  },
  {
    id: 2,
    title: 'Chave de Carro com Chaveiro UEMG',
    category: 'Chaves',
    location: 'Bloco 4 - Lanchonete',
    date: '23 Ago',
    status: 'achado',
    imageUrl: ''
  },
  {
    id: 3,
    title: 'Calculadora Científica Casio',
    category: 'Eletrônicos',
    location: 'Biblioteca',
    date: '22 Ago',
    status: 'perdido',
    imageUrl: ''
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');

  const filteredItems = MOCK_ITEMS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'todos' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa Rápida */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar pertence (ex: chave, caderno)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Filtros Rápido (Segunda Heurística: Correspondência com o mundo real) */}
      <div className="flex gap-2 text-xs font-medium">
        <button
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-lg border ${
            filter === 'todos' ? 'bg-indigo-900 text-white border-indigo-900' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('perdido')}
          className={`px-3 py-1.5 rounded-lg border ${
            filter === 'perdido' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Perdidos
        </button>
        <button
          onClick={() => setFilter('achado')}
          className={`px-3 py-1.5 rounded-lg border ${
            filter === 'achado' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Achados
        </button>
      </div>

      {/* Lista de Itens */}
      <div className="space-y-3 pt-1">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ItemCard key={item.id} {...item} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">
            Nenhum pertença encontrada com este termo.
          </div>
        )}
      </div>
    </div>
  );
}