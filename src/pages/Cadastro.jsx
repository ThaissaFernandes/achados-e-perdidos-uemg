import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrarUsuario } from '../services/usuarioService';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [numeroCadastro, setNumeroCadastro] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('usuario');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await cadastrarUsuario({
        email: email.trim(),
        senha,
        nome: nome.trim(),
        numeroCadastro: numeroCadastro.trim(),
        tipo
      });
      navigate('/');
    } catch (err) {
      console.error("Erro detalhado do Firebase:", err);

      // Tratamento específico de códigos de erro do Firebase Auth
      if (err.code === 'auth/email-already-in-use') {
        setErro('Este e-mail já está cadastrado. Tente realizar o login.');
      } else if (err.code === 'auth/weak-password') {
        setErro('A senha deve conter no mínimo 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setErro('O formato do e-mail informado é inválido.');
      } else if (err.code === 'permission-denied') {
        setErro('Sem permissão no Firestore. Verifique as Regras de Segurança.');
      } else {
        setErro(err.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 text-center">Criar Conta</h2>

        {erro && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
            {erro}
          </div>
        )}

        <form onSubmit={handleCadastro} className="space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome Completo</label>
            <input
              type="text"
              required
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">E-mail Institucional</label>
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
            <label className="block text-gray-700 font-medium mb-1">Matrícula / Registro Funcional</label>
            <input
              type="text"
              inputMode="numeric"
              required
              placeholder="Digite apenas números"
              value={numeroCadastro}
              onChange={(e) => setNumeroCadastro(e.target.value.replace(/\D/g, ''))}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Tipo de Perfil</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-600 text-gray-700"
            >
              <option value="usuario">Usuário Comum</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Senha</label>
            <input
              type="password"
              required
              placeholder="Sua senha de acesso"
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
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-indigo-900 font-bold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}