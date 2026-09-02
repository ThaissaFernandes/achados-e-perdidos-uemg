import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Tag, FileText, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { criarItem } from '../services/itemService';
import { listarCategorias } from '../services/categoriaService';
import { listarLocaisAtivos } from '../services/localService';
import { useAuth } from '../context/AuthContext';

export default function RegistrarItem() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    status: 'disponível',
    imagePreview: null
  });

  const [carregando, setCarregando] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [erro, setErro] = useState('');

  // Carrega categorias e locais do Firestore
  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [dadosCategorias, dadosLocais] = await Promise.all([
          listarCategorias(),
          listarLocaisAtivos()
        ]);
        setCategorias(dadosCategorias || []);
        setLocais(dadosLocais || []);
      } catch (err) {
        console.error("Erro ao carregar selects:", err);
      }
    }
    carregarOpcoes();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imagePreview: imageUrl }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await criarItem({
        titulo: formData.title.trim(),
        categoriaId: formData.category,
        localEncontrado: formData.location,
        descricao: formData.description.trim(),
        status: formData.status,
        fotoUrl: formData.imagePreview || '',
        criadoPor: usuario?.uid || 'admin',
        dataCadastro: new Date()
      });

      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Erro ao cadastrar pertence:", err);
      setErro('Falha ao cadastrar o pertence. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-3">
        <CheckCircle2 size={64} className="text-emerald-600 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-800">Pertence Cadastrado!</h2>
        <p className="text-xs text-gray-500">
          O registro foi concluído. Redirecionando para a página inicial...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-20 max-w-md mx-auto">
      {/* Voltar + Cabeçalho */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/perfil')} 
          className="p-1.5 rounded-xl text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-base font-bold text-gray-800">Registrar Pertence (Administração)</h2>
          <p className="text-[11px] text-gray-500">Cadastre um objeto recebido no balcão</p>
        </div>
      </div>

      {erro && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Status do Item */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Status Inicial</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'disponível' })}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-all ${
                formData.status === 'disponível'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Disponível no Setor
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'em análise' })}
              className={`py-2.5 px-3 rounded-xl font-bold border transition-all ${
                formData.status === 'em análise'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Em Análise
            </button>
          </div>
        </div>

        {/* Foto do Objeto */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Foto do Pertence (Opcional)</label>
          <label className="border-2 border-dashed border-gray-200 rounded-2xl h-28 flex flex-col justify-center items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors overflow-hidden relative">
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Camera size={24} />
                <span className="text-[11px] font-medium">Toque para anexar uma foto</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Título */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Título / Nome do Pertence</label>
          <div className="relative">
            <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Ex: Caderno Espiral Tilibra Capa Preta"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-900"
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Categoria</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-900 text-gray-700"
          >
            <option value="">Selecione uma categoria...</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nome || cat.title}</option>
            ))}
          </select>
        </div>

        {/* Local */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Local Encontrado</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-900 text-gray-700"
            >
              <option value="">Selecione o local no campus...</option>
              {locais.map((loc) => (
                <option key={loc.id} value={loc.nome}>{loc.nome}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detalhes */}
        <div className="space-y-1">
          <label className="font-semibold text-gray-700">Detalhes Adicionais</label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              rows={3}
              placeholder="Ex: Entregue por um aluno do Bloco A no setor."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-900 text-gray-700"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={carregando}
          className="w-full py-3 bg-indigo-900 text-white font-semibold rounded-xl shadow-sm hover:bg-indigo-800 transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {carregando ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Salvando no Sistema...</span>
            </>
          ) : (
            'Confirmar e Publicar Pertence'
          )}
        </button>
      </form>
    </div>
  );
}