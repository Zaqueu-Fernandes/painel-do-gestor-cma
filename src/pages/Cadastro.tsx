import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario, formatarTelefone, validarTelefone } from '../services/supabase';

const Cadastro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ tipo: string; titulo: string; mensagem: string } | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    senha: ''
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'telefone') {
      const formatado = formatarTelefone(value);
      setFormData({ ...formData, [name]: formatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      novosErros.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'E-mail inválido';
    }
    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (!validarTelefone(formData.telefone)) {
      novosErros.telefone = 'Telefone inválido. Insira o DDD + o número 9 + seu número Ex: (XX)9XXXXXXXX';
    }
    if (!formData.cargo.trim()) novosErros.cargo = 'Cargo é obrigatório';
    if (!formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarModal('info', 'Atenção', 'Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);

    try {
      const resultado = await cadastrarUsuario(formData);

      if (resultado.sucesso) {
        navigate('/confirmacao');
      } else {
        if (resultado.mensagem === 'EMAIL_EXISTE') {
          mostrarModal('erro', 'E-mail já cadastrado', 'O e-mail informado já está sendo usado. Entre em contato com o suporte caso tenha esquecido seus dados.');
        } else {
          mostrarModal('erro', 'Erro', resultado.mensagem);
        }
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      mostrarModal('erro', 'Erro', 'Erro ao realizar cadastro');
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

  const inputClass = (field: string) =>
    `w-full p-3 border-2 rounded-lg text-base transition-colors focus:outline-none focus:border-green-800 ${
      erros[field] ? 'border-red-500' : 'border-gray-200'
    }`;

  return (
    <div className="min-h-[calc(100vh-250px)] flex items-center justify-center px-5 py-10">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-[400px] w-full">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <i className="fas fa-user-plus text-4xl text-white"></i>
        </div>
        <h2 className="text-center text-gray-700 mb-8 text-2xl font-bold">
          <i className="fas fa-user-plus mr-2 text-green-800"></i> Solicitar Cadastro
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            { name: 'nome', type: 'text', placeholder: 'Nome Completo' },
            { name: 'email', type: 'email', placeholder: 'E-mail' },
            { name: 'telefone', type: 'tel', placeholder: '(88) 9XXXXXXXX' },
            { name: 'cargo', type: 'text', placeholder: 'Cargo ou Função' },
            { name: 'senha', type: 'password', placeholder: 'Defina uma senha' },
          ].map(field => (
            <div key={field.name} className="mb-4">
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                disabled={loading}
                maxLength={field.name === 'telefone' ? 15 : undefined}
                className={inputClass(field.name)}
              />
              {erros[field.name] && <p className="text-red-500 text-sm mt-1">{erros[field.name]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3.5 bg-green-800 text-white rounded-lg text-base font-bold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Cadastrando...
              </>
            ) : (
              'Solicitar Acesso'
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-gray-700 text-sm">
          Já tem conta?{' '}
          <a onClick={() => navigate('/login')} className="text-green-800 font-bold cursor-pointer hover:underline">
            Voltar ao Login
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
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-700">{modal.titulo}</h3>
            <p className="text-base text-gray-700 mb-6 leading-relaxed">{modal.mensagem}</p>
            <div className="flex gap-2.5 justify-center items-center">
              {modal.tipo === 'erro' && (
                <a href="https://wa.me/5588994014262" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-green-500 text-white rounded-full font-bold transition-transform hover:scale-105 inline-flex items-center gap-2 no-underline">
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
              )}
              <a onClick={fecharModal} className="text-green-800 font-bold cursor-pointer hover:underline">
                Voltar ao {modal.tipo === 'erro' ? 'login' : 'cadastro'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;
