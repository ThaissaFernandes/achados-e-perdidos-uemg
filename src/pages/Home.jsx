import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { listarItens } from '../services/itemService';
import { listarCategorias } from '../services/categoriaService';

export default function Home() {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('todos');

  // Busca itens e categorias do Firestore ao carregar a tela
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosItens, dadosCategorias] = await Promise.all([
          listarItens(),
          listarCategorias()
        ]);
        setItems(dadosItens);
        setCategorias(dadosCategorias);
      } catch (error) {
        console.error("Erro ao carregar dados do Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Converte o ID da categoria para o nome real com comparação segura
const obterNomeCategoria = (categoriaId) => {
  if (!categoriaId) return 'Geral';

  // Se o item já tiver o nome direto (fallback)
  if (typeof categoriaId === 'string' && !categoriaId.match(/^[a-zA-Z0-9]{15,}$/)) {
    return categoriaId;
  }

  // Compara limpando espaços e garantindo tipo String
  const cat = categorias.find(c => String(c.id).trim() === String(categoriaId).trim());
  
  return cat ? (cat.nome || cat.title || 'Geral') : 'Geral';
};

  // Formata o Timestamp exibindo apenas dia e mês (ex: "30 ago")
  const formatarData = (item) => {
    const data = item.dataEncontrado || item.dataCadastro || item.data;

    if (data?.seconds) {
      return new Date(data.seconds * 1000).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      }).replace('.', '');
    }

    if (typeof data === 'string') return data;

    return 'Recente';
  };

  // Lógica de filtragem
  const filteredItems = items.filter(item => {
    const titulo = item.titulo || item.title || '';
    const statusItem = (item.status || '').toLowerCase();

    const matchesSearch = titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'todos' || statusItem === filter.toLowerCase();
    
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

      {/* Filtros Rápidos */}
      <div className="flex gap-2 text-xs font-medium">
        <button
          onClick={() => setFilter('todos')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'todos' 
              ? 'bg-indigo-900 text-white border-indigo-900' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('disponível')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'disponível' 
              ? 'bg-emerald-600 text-white border-emerald-600' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Disponíveis
        </button>
        <button
          onClick={() => setFilter('em análise')}
          className={`px-3 py-1.5 rounded-lg border transition-colors ${
            filter === 'em análise' 
              ? 'bg-amber-600 text-white border-amber-600' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Em Análise
        </button>
      </div>

      {/* Feedback de Carregamento */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-900 mb-2" />
          <p className="text-xs">Carregando pertences...</p>
        </div>
      ) : (
        /* Lista de Itens */
        <div className="space-y-3 pt-1">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                id={item.id}
                title={item.titulo || item.title}
                category={obterNomeCategoria(item.categoriaId)}
                location={item.localEncontrado || item.location}
                date={formatarData(item)}
                status={item.status || 'Disponível'}
                imageUrl={item.fotoUrl || item.imageUrl}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Nenhum pertence encontrado com este termo.
            </div>
          )}
        </div>
      )}
    </div>
  );
}