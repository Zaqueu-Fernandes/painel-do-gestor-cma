import { useNavigate } from 'react-router-dom';

const Confirmacao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-250px)] flex flex-col items-center justify-center p-5 text-white text-center">
      <div className="w-[100px] h-[100px] bg-green-500 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-check text-5xl text-white"></i>
      </div>
      <h2 className="text-3xl font-bold mb-4">Cadastro Concluído!</h2>
      <p className="text-lg mb-2.5 max-w-[500px]">Cadastro pendente de aprovação</p>
      <p className="text-sm opacity-90 mb-8">
        (entre em contato com o suporte para agilizar a liberação)
      </p>
      <a
        href="https://wa.me/5588994014262"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 inline-flex items-center gap-2 px-8 py-3.5 no-underline"
      >
        <i className="fab fa-whatsapp"></i> Chamar no WhatsApp
      </a>
      <p className="mt-5">
        <a onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">
          Voltar ao login
        </a>
      </p>
    </div>
  );
};

export default Confirmacao;
