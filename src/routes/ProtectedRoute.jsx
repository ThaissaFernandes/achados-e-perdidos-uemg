import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente de Rota Protegida
 * @param {boolean} requireAdmin - Se true, exige o perfil de Administrador para acessar.
 */
export default function ProtectedRoute({ requireAdmin = false }) {
  // Ajuste 1: Garanta o nome correto da variável exposta pelo useAuth()
  const { usuario, loading } = useAuth();

  // 1. Enquanto verifica o estado de autenticação no Firebase
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-xs text-gray-500">Verificando permissões...</p>
      </div>
    );
  }

  // 2. Se o usuário não estiver autenticado, redireciona para a página de perfil/login
 if (!usuario) {
  return <Navigate to="/login" replace />;
}

  // 3. Ajuste 2: Mudar de .perfil para .tipo (que é a chave usada no Firestore)
  if (requireAdmin && usuario.tipo !== 'admin') {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm">
          <p className="font-bold mb-1">Acesso Restrito</p>
          <p>Sua conta não possui permissões administrativas para realizar esta operação.</p>
        </div>
      </div>
    );
  }

  // 4. Se passou em todas as verificações, renderiza a página protegida
  return <Outlet />;
}