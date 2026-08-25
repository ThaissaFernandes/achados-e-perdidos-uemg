import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Tag, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

// Locais reais do Campus UEMG Divinópolis para facilitar o preenchimento (Redução de Erros - IHC)
const LOCAIS_UEMG = [
  'Bloco A — Salas de Aula',
  'Bloco B — Laboratórios',
  'Bloco C — Administrativo',
  'Biblioteca Central',
  'Cantina / Praça de Convivência',
  'Estacionamento',
  'Quadra Poliesportiva / Ginásio'
];

const CATEGORIAS = [
  'Eletrônicos (Celulares, Fones, Carregadores)',
  'Documentos e Cartões',
  'Chaves',
  'Material Acadêmico (Cadernos, Livros, Estojos)',
  'Acessórios e Vestuário (Garrafas, Casacos, Óculos)',
  'Outros'
];

export default function RegistrarItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    description: '',
    status: 'perdido', // Padrão
    imagePreview: null
  });

  const [submitted, setSubmitted] = useState(false);

  // Simulação de upload visual da foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imagePreview: imageUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Exibe feedback visual de sucesso (1ª Heurística de Nielsen - Status do Sistema)
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 1800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-3 animate-fade-in">
        <CheckCircle2 size={64} className="text-green-600 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-800">Pertence Cadastrado!</h2>
        <p className="text-sm text-gray-600">
          O registro foi concluído. Redirecionando para a página inicial...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {/* Botão Voltar + Título */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/')} 
          className="p-1 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Registrar Pertence</h2>
          <p className="text-xs text-gray-500">Informe os detalhes para ajudar na identificação</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Toggle Visual: Perdido vs Achado (Correspondência com o mundo real) */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Tipo de Ocorrência</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'perdido' })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex justify-center items-center gap-1.5 transition-all ${
                formData.status === 'perdido'
                  ? 'bg-red-600 text-white border-red-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Eu Perdi
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'achado' })}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex justify-center items-center gap-1.5 transition-all ${
                formData.status === 'achado'
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Eu Encontrei
            </button>
          </div>
        </div>

        {/* Upload de Imagem Visual */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Foto do Objeto (Opcional)</label>
          <label className="border-2 border-dashed border-gray-300 rounded-2xl h-32 flex flex-col justify-center items-center cursor-pointer bg-white hover:bg-gray-50 transition-colors overflow-hidden relative">
            {formData.imagePreview ? (
              <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <Camera size={28} />
                <span className="text-xs font-medium">Toque para anexar uma foto</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        {/* Título do Objeto */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">O que foi perdido/encontrado?</label>
          <div className="relative">
            <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Ex: Caderno Espiral Preto da Tilibra"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Categoria</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700"
          >
            <option value="">Selecione uma categoria...</option>
            {CATEGORIAS.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Localização UEMG */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Local no Campus Divinópolis</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700"
            >
              <option value="">Selecione o local aproximado...</option>
              {LOCAIS_UEMG.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Descrição Adicional */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700">Detalhes Adicionais</label>
          <div className="relative">
            <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              rows={3}
              placeholder="Ex: Possui um adesivo da UEMG na capa e foi deixado próximo à janela."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700"
            />
          </div>
        </div>

        {/* Botão de Envio Principal */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-900 text-white font-semibold text-xs rounded-xl shadow-md hover:bg-indigo-800 active:scale-[0.99] transition-all"
        >
          Confirmar e Publicar Pertence
        </button>

      </form>
    </div>
  );
}