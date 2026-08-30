import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext'; // Contexto de Autenticação do Usuário
import { criarSolicitacaoDevolucao } from '../services/solicitacaoService';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioLogado } = useAuth(); // Obtém os dados do usuário atual

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'itens', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        }
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar item:', err);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleSolicitarDevolucao = async () => {
    if (!usuarioLogado) {
      // Exemplo de regra: obriga autenticação para reivindicar (conforme Caso de Uso)
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await criarSolicitacaoDevolucao(item.id, usuarioLogado);
      setSubmitting(false);
      setIsModalOpen(false);
      setMensagemSucesso(true);
      // Atualiza o estado local para refletir a mudança imediatamente na UI
      setItem((prev) => ({ ...prev, status: 'Em análise' }));
    } catch (err) {
      setSubmitting(false);
      alert('Ocorreu um erro ao processar sua solicitação.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600 text-sm">Carregando detalhes...</p>
      </div>
    );
  }

  if (!item) {
    return <div className="p-4 text-center">Objeto não encontrado.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Imagem Ampliada do Item */}
      <div className="w-full h-64 bg-gray-200">
        <img
          src={item.fotoUrl || 'https://via.placeholder.com/400'}
          alt={item.titulo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bloco de Detalhes */}
      <div className="p-4 bg-white rounded-t-2xl -mt-4 shadow-md flex-1">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-xl font-bold text-gray-800">{item.titulo}</h1>
          
          {/* Tag Colorida de Status (Visibilidade do Estado) */}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              item.status === 'Disponível'
                ? 'bg-emerald-100 text-emerald-800'
                : item.status === 'Em análise'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {item.status}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-700">Descrição:</span>
            <p className="mt-1">{item.descricao}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Local Encontrado:</span>
            <p>{item.localEncontrado}</p>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Data de Registro:</span>
            <p>{item.dataRegistro ? new Date(item.dataRegistro.toDate()).toLocaleDateString('pt-BR') : 'N/A'}</p>
          </div>
        </div>

        {/* Feedback de Sucesso */}
        {mensagemSucesso && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm text-center">
            Solicitação enviada com sucesso! A administração da UEMG analisará o pedido.
          </div>
        )}

        {/* Botão Principal de Ação */}
        <div className="mt-6">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={item.status !== 'Disponível' || mensagemSucesso}
            className={`w-full py-3 rounded-xl font-medium text-white transition ${
              item.status === 'Disponível' && !mensagemSucesso
                ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {item.status === 'Disponível' ? 'Reivindicar Pertence' : `Item ${item.status}`}
          </button>
        </div>
      </div>

      {/* Modal de Prevenção de Erros / Confirmação (IHC) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reivindicar este pertence?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Ao confirmar, uma solicitação será enviada para a Administração validar se este pertence realmente é seu.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                onClick={handleSolicitarDevolucao}
                disabled={submitting}
                className="flex-1 py-2.5 bg-emerald-600 rounded-xl font-medium text-white hover:bg-emerald-700 flex justify-center items-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}