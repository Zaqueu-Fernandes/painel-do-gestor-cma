import React, { useState } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Confirmacao from './pages/Confirmacao';
import PainelGestor from './components/PainelGestor';
import AnaliseFinanceira from './components/AnaliseFinanceira';
import './index.css';

const App = () => {
  const [user, setUser] = useState<any>(null); 
  const [view, setView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('aba1'); 

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  if (view === 'login') {
    return (
      <Login 
        onLoginSuccess={(userData) => {
          setUser(userData);
          setView('dashboard');
        }} 
        onGoToSignup={() => setView('signup')} 
      />
    );
  }

  if (view === 'signup') {
    return (
      <Cadastro 
        onGoToLogin={() => setView('login')} 
        onSuccess={() => setView('confirmacao')} 
      />
    );
  }

  if (view === 'confirmacao') {
    return <Confirmacao onGoToLogin={() => setView('login')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white p-6 shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-green-700 p-2 rounded-lg">
              <i className="fa-solid fa-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black text-green-800 leading-none">CMA</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Câmara Municipal de Araripe</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="hidden md:block text-right">
              <p className="font-bold text-gray-800">{user?.nome}</p>
              <p className="text-xs text-green-600 font-medium">{user?.cargo}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-full transition-colors"
              title="Sair do sistema"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex">
          <button 
            onClick={() => setActiveTab('aba1')}
            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'aba1' 
              ? 'border-green-700 text-green-700 bg-green-50' 
              : 'border-transparent text-gray-500 hover:text-green-600'
            }`}
          >
            <i className="fa-solid fa-table-list mr-2"></i> Painel do Gestor
          </button>
          <button 
            onClick={() => setActiveTab('aba2')}
            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === 'aba2' 
              ? 'border-green-700 text-green-700 bg-green-50' 
              : 'border-transparent text-gray-500 hover:text-green-600'
            }`}
          >
            <i className="fa-solid fa-chart-pie mr-2"></i> Análise Financeira
          </button>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6 mb-20">
        {user?.userStatus !== 'APROVADO' ? (
          <div className="bg-white p-12 rounded-2xl shadow-xl text-center border border-yellow-100 animate-fadeIn max-w-2xl mx-auto mt-10">
            <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-clock-rotate-left text-4xl text-yellow-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Cadastro Pendente</h2>
            <p className="text-gray-600 mt-4">
              Olá <b>{user?.nome}</b>, seu acesso está aguardando aprovação administrativa na planilha <b>CMA</b>.
            </p>
            <div className="mt-8">
               <a 
                href="https://wa.me/5588994014262" 
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-md inline-flex items-center"
              >
                <i className="fa-brands fa-whatsapp mr-2 text-xl"></i> Agilizar Liberação
              </a>
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            {activeTab === 'aba1' ? <PainelGestor /> : <AnaliseFinanceira />}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white border-t border-gray-200 py-3 z-50">
        <div className="text-center text-gray-600 text-xs md:text-sm">
          <p>Copyright © 2026 | <strong>Zaqueu Fernandes</strong> | Suporte Técnico</p>
          <a 
            href="https://wa.me/5588994014262" 
            target="_blank"
            rel="noreferrer"
            className="text-green-700 font-bold hover:underline"
          >
            Precisa de ajuda? Clique aqui.
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
