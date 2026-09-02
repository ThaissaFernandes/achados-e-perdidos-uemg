import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { 
  User, Mail, LogOut, Shield, Clock, FileCheck, 
  PackagePlus, MapPinPlus, HelpCircle, Info 
} from 'lucide-react';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

// Requisições de devolução do aluno
const INITIAL_SOLICITACOES = [
  {
    id: 101,
    itemTitulo: 'Chaveiro com 3 Chaves e Fita Azul',
    codigoRetirada: 'REQ-8842',
    dataSolicitacao: '01 Set',
    status: 'aprovado', // 'pendente' | 'aprovado' | 'entregue'
    localRetirada: 'Administração — Bloco Central'
  }
];

export default function Profile() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [solicitacoes] = useState(INITIAL_SOLICITACOES);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao encerrar a sessão:", error);
    }
  };

  const isAdmin = usuario?.tipo === 'admin';

  return (
    <div className="space-y-5 pb-20 max-w-md mx-auto">
      
      {/* 1. Cartão do Usuário */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${
            isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-indigo-100 border-indigo-200'
          }`}>
            {isAdmin ? (
              <Shield size={28} className="text-amber-700" />
            ) : (
              <User size={28} className="text-indigo-900" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-bold text-gray-900 truncate">
              {usuario?.nome || 'Usuário UEMG'}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <Mail size={12} /> {usuario?.email || 'usuario@aluno.uemg.br'}
            </p>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
              isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {isAdmin ? 'Administrador — Campus Divinópolis' : 'Estudante — Campus Divinópolis'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shrink-0"
          title="Sair da Conta"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* 2. PAINEL DO ADMINISTRADOR (Somente Admin pode Cadastrar Pertences) */}
      {isAdmin ? (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield size={16} className="text-amber-700" />
            Painel de Gestão da Administração
          </h3>
          <p className="text-[11px] text-amber-800">
            Cadastre pertences entregues no setor ou gerencie as opções do sistema.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Botão direcionando diretamente para a tela de registro de item */}
            <button 
              onClick={() => navigate('/registrar-item')}
              className="flex items-center justify-center gap-1.5 p-3 bg-amber-600 text-white font-semibold rounded-xl text-xs hover:bg-amber-700 transition shadow-sm col-span-2 active:scale-[0.98]"
            >
              <PackagePlus size={16} />
              Cadastrar Novo Pertence
            </button>
            
            <button 
              onClick={() => alert("Navegar para Gestão de Locais")}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-100/50 transition"
            >
              <MapPinPlus size={15} className="text-amber-700" />
              Locais Campus
            </button>

            <button 
              onClick={() => alert("Validar Devoluções")}
              className="flex items-center justify-center gap-1.5 p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-100/50 transition"
            >
              <FileCheck size={15} className="text-amber-700" />
              Validar Entregas
            </button>
          </div>
        </div>
      ) : (
        /* 3. GUIA RÁPIDA PARA O ESTUDANTE */
        <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
            <Info size={16} className="text-blue-700" />
            Encontrou algum pertence perdido no campus?
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Entregue o objeto diretamente na <strong className="font-semibold">Administração do Campus</strong>. A equipe responsável fará o cadastro oficial no sistema para que o dono possa resgatá-lo.
          </p>
        </div>
      )}

      {/* 4. SEÇÃO DE REQUISIÇÕES DE RETIRADA (Exclusivo Aluno) */}
      {!isAdmin && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <Clock size={16} className="text-indigo-600" />
            Minhas Recomendações de Retirada ({solicitacoes.length})
          </h3>

          {solicitacoes.length > 0 ? (
            solicitacoes.map(sol => (
              <div key={sol.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{sol.itemTitulo}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{sol.localRetirada}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    sol.status === 'pendente' 
                      ? 'bg-amber-100 text-amber-800' 
                      : sol.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {sol.status === 'aprovado' ? 'Pronto p/ Retirada' : sol.status}
                  </span>
                </div>

                {sol.status === 'aprovado' && (
                  <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-xl text-[11px] text-emerald-900 flex justify-between items-center">
                    <span>Apresente este código no balcão:</span>
                    <strong className="font-mono text-xs text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {sol.codigoRetirada}
                    </strong>
                  </div>
                )}

                <div className="text-[10px] text-gray-400 border-t border-gray-50 pt-1.5 flex items-center gap-1">
                  <FileCheck size={12} /> Solicitado em {sol.dataSolicitacao}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-xs border border-gray-100">
              Você ainda não requisitou a retirada de nenhum objeto.
            </div>
          )}
        </div>
      )}

    </div>
  );
}