import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { realizarLogin } from '../services/usuarioService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Autentica no Firebase e carrega o perfil do Firestore
      await realizarLogin(email.trim(), senha);
      
      // Direciona todos os usuários para a Home unificada ('/')
      navigate('/');
    } catch (err) {
      console.error("Erro ao autenticar:", err);
      setErro('E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 text-center">Entrar no Sistema</h2>

        {erro && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail</label>
            <input
              type="email"
              required
              placeholder="seu.nome@discente.uemg.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Senha</label>
            <input
              type="password"
              required
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 bg-indigo-900 text-white rounded-xl font-semibold hover:bg-indigo-800 transition disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-indigo-900 font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}