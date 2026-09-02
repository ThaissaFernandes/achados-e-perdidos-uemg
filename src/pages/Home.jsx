import { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Tag, ShieldAlert } from 'lucide-react';
import ItemCard from '../components/ItemCard';
import { listarItens } from '../services/itemService';
import { listarCategorias } from '../services/categoriaService';
import { listarLocaisAtivos } from '../services/localService';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { eAdmin } = useAuth(); // Hook de autenticação para identificar se é Admin
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [localSelecionado, setLocalSelecionado] = useState('');

  // Carrega itens, categorias e locais ativos do Firestore
  useEffect(() => {
    async function carregarDados() {
      try {
        const [dadosItens, dadosCategorias, dadosLocais] = await Promise.all([
          listarItens(),
          listarCategorias(),
          listarLocaisAtivos()
        ]);
        setItems(dadosItens);
        setCategorias(dadosCategorias);
        setLocais(dadosLocais);
      } catch (error) {
        console.error("Erro ao carregar dados do Firestore:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Converte o ID da categoria para o nome real
  const obterNomeCategoria = (categoriaId) => {
    if (!categoriaId) return 'Geral';
    if (typeof categoriaId === 'string' && !categoriaId.match(/^[a-zA-Z0-9]{15,}$/)) {
      return categoriaId;
    }
    const cat = categorias.find(c => String(c.id).trim() === String(categoriaId).trim());
    return cat ? (cat.nome || cat.title || 'Geral') : 'Geral';
  };

  // Formata a Data para exibição amigável
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

  // Lógica de filtragem combinada
  const filteredItems = items.filter(item => {
    const titulo = (item.titulo || item.title || '').toLowerCase();
    const statusItem = (item.status || 'disponível').toLowerCase();
    const localItem = (item.localEncontrado || item.location || '').toLowerCase();
    const catId = String(item.categoriaId || '').trim();

    const matchesSearch = titulo.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || statusItem === filterStatus.toLowerCase();
    const matchesCategoria = !categoriaSelecionada || catId === categoriaSelecionada;
    const matchesLocal = !localSelecionado || localItem.includes(localSelecionado.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategoria && matchesLocal;
  });

  return (
    <div className="space-y-4 max-w-md mx-auto pb-20">
      
      {/* Banner de Modo Administrador (Feedback Visual de IHC) */}
      {eAdmin && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-2xl text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-700 shrink-0" />
            <div>
              <p className="font-bold">Modo Administrador</p>
              <p className="text-[10px] text-amber-700">Visualizando visão estendida do campus</p>
            </div>
          </div>
          <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
            Admin
          </span>
        </div>
      )}

      {/* Barra de Pesquisa Rápida */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Buscar pertence (ex: chave, caderno)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-indigo-900 shadow-sm"
        />
      </div>

      {/* Seletores de Categoria e Local */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
            <Tag size={12} /> Categoria
          </label>
          <select
            value={categoriaSelecionada}
            onChange={(e) => setCategoriaSelecionada(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-900"
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome || cat.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-600 mb-1 flex items-center gap-1">
            <MapPin size={12} /> Local
          </label>
          <select
            value={localSelecionado}
            onChange={(e) => setLocalSelecionado(e.target.value)}
            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-indigo-900"
          >
            <option value="">Todos</option>
            {locais.map((loc) => (
              <option key={loc.id} value={loc.nome}>{loc.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros Rápidos de Status */}
      <div className="flex gap-2 text-xs font-medium pt-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterStatus('todos')}
          className={`px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
            filterStatus === 'todos' 
              ? 'bg-indigo-900 text-white border-indigo-900' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterStatus('disponível')}
          className={`px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
            filterStatus === 'disponível' 
              ? 'bg-emerald-600 text-white border-emerald-600' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Disponíveis
        </button>
        <button
          onClick={() => setFilterStatus('em análise')}
          className={`px-3 py-1.5 rounded-lg border transition-colors shrink-0 ${
            filterStatus === 'em análise' 
              ? 'bg-amber-600 text-white border-amber-600' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          Em Análise
        </button>
      </div>

      {/* Exibição da Lista de Pertences */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-900 mb-2" />
          <p className="text-xs">Carregando pertences...</p>
        </div>
      ) : (
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
            <div className="text-center py-8 bg-white rounded-2xl border border-gray-100 text-gray-500 text-xs">
              Nenhum pertence encontrado com os filtros aplicados.
            </div>
          )}
        </div>
      )}
    </div>
  );
}