import { useState } from 'react';
import { User, CheckCircle, Trash2, Tag, Mail, MapPin } from 'lucide-react';

// Dados simulados do usuário logado e seus itens cadastrados
const INITIAL_USER_ITEMS = [
  {
    id: 1,
    title: 'Garrafa Térmica Pacco Azul',
    category: 'Acessórios',
    location: 'Bloco A — Sala 204',
    date: '24 Ago',
    status: 'perdido',
    resolved: false
  },
  {
    id: 2,
    title: 'Caderno Espiral Preto',
    category: 'Material Acadêmico',
    location: 'Biblioteca Central',
    date: '18 Ago',
    status: 'achado',
    resolved: true // Já foi entregue/recuperado
  }
];

export default function Profile() {
  const [userItems, setUserItems] = useState(INITIAL_USER_ITEMS);

  // Alterar status para Devolvido / Resolvido
  const handleToggleResolve = (id) => {
    setUserItems(prev => prev.map(item => 
      item.id === id ? { ...item, resolved: !item.resolved } : item
    ));
  };

  // Remover publicação
  const handleDeleteItem = (id) => {
    setUserItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-5 pb-6">
      
      {/* Cabeçalho do Perfil (Identificação do Usuário UEMG) */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
          <User size={28} className="text-indigo-900" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-gray-900 truncate">Thaíssa Fernandes</h2>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <Mail size={12} /> thaissa.fernandes@aluno.uemg.br
          </p>
          <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
            Estudante — Campus Divinópolis
          </span>
        </div>
      </div>

      {/* Seção de Gerenciamento de Pertence Cadastrados */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
          <Tag size={16} className="text-indigo-600" />
          Meus Registros ({userItems.length})
        </h3>

        {userItems.length > 0 ? (
          userItems.map(item => (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl p-3 border transition-all shadow-sm ${
                item.resolved ? 'opacity-60 border-gray-200' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className={`text-xs font-bold ${item.resolved ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={11} /> {item.location}
                  </p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  item.resolved 
                    ? 'bg-gray-200 text-gray-700' 
                    : item.status === 'perdido' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {item.resolved ? 'Resolvido' : item.status}
                </span>
              </div>

              {/* Ações de Controle e Liberdade do Usuário (IHC) */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 mt-2 text-xs">
                <button
                  onClick={() => handleToggleResolve(item.id)}
                  className={`flex items-center gap-1 font-medium text-[11px] px-2.5 py-1 rounded-lg transition-colors ${
                    item.resolved 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <CheckCircle size={14} />
                  {item.resolved ? 'Reabrir Item' : 'Marcar como Devolvido'}
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir Registro"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-xs">
            Você ainda não cadastrou nenhum pertence.
          </div>
        )}
      </div>

    </div>
  );
}