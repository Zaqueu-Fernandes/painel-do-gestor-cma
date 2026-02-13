import React from 'react';

interface ConfirmacaoProps {
  onGoToLogin: () => void;
}

const Confirmacao = ({ onGoToLogin }: ConfirmacaoProps) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-green-100 text-center max-w-md w-full">
        <div className="mb-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <i className="fa-solid fa-check text-5xl text-green-600"></i>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Solicitação Enviada!</h2>
        <p className="text-gray-600 mb-8">
          Seu cadastro foi realizado com sucesso e está <strong>pendente de aprovação</strong> administrativa. 
          Você receberá um aviso assim que seu acesso for liberado.
        </p>
        
        <div className="space-y-4">
          <a 
            href="https://wa.me/5588994014262" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md active:scale-95"
          >
            <i className="fa-brands fa-whatsapp mr-2 text-xl"></i> Falar com Suporte
          </a>
          
          <button 
            onClick={onGoToLogin} 
            className="block w-full text-green-700 font-bold hover:underline py-2"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmacao;
