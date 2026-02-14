import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface LoginProps {
  setUsuario: (u: any) => void;
}

const Login = ({ setUsuario }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [modal, setModal] = useState<{ tipo: string; titulo: string; mensagem: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      mostrarModal('info', 'Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .single();

      if (error || !data) {
        mostrarModal(
          'erro',
          'Erro de Autenticação',
          'E-mail ou Senha Incorretos. Entre em contato com o suporte caso tenha esquecido seus dados.'
        );
        setLoading(false);
        return;
      }

      if (data.status === false) {
        mostrarModal(
          'pendente',
          'Cadastro pendente de aprovação',
          'Seu cadastro está aguardando liberação. Entre em contato com o suporte para agilizar.'
        );
        setLoading(false);
        return;
      }

      setUsuario(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      mostrarModal('erro', 'Erro', 'Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const mostrarModal = (tipo: string, titulo: string, mensagem: string) => {
    setModal({ tipo, titulo, mensagem });
  };

  const fecharModal = () => {
    setModal(null);
  };

  return (
    <div className="min-h-[calc(100vh-250px)] flex items-center justify-center px-5 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-[400px] w-full">
        <div className="w-20 h-20 bg-green-800 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fas fa-lock text-4xl text-white"></i>
        </div>
        <h2 className="text-center text-gray-700 mb-8 text-2xl font-bold">
          <i className="fas fa-lock mr-2 text-green-800"></i> Acesso ao Painel
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-green-800"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-green-800"
            />
          </div>

          {erro && <p className="text-red-500 text-sm mt-1">{erro}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 bg-green-800 text-white rounded-lg text-base font-bold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Logando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-700 text-sm">
          Não tem conta?{' '}
          <a onClick={() => navigate('/cadastro')} className="text-green-800 font-bold cursor-pointer hover:underline">
            Cadastre-se aqui
          </a>
        </p>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={fecharModal}>
          <div className="bg-white p-8 rounded-xl max-w-[500px] w-[90%] text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-5xl mb-4">
              {modal.tipo === 'info' && <i className="fas fa-info-circle text-amber-500"></i>}
              {modal.tipo === 'erro' && <i className="fas fa-exclamation-circle text-red-500"></i>}
              {modal.tipo === 'pendente' && <i className="fas fa-clock text-amber-500"></i>}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-700">{modal.titulo}</h3>
            <p className="text-base text-gray-700 mb-6 leading-relaxed">{modal.mensagem}</p>
            <div className="flex gap-2.5 justify-center items-center">
              {(modal.tipo === 'erro' || modal.tipo === 'pendente') && (
                <a href="https://wa.me/5588994014262" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-green-500 text-white rounded-full font-bold transition-transform hover:scale-105 inline-flex items-center gap-2 no-underline">
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
              )}
              <a onClick={fecharModal} className="text-green-800 font-bold cursor-pointer hover:underline">
                {modal.tipo === 'info' ? 'OK' : 'Voltar ao login'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
