import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Confirmacao from './pages/Confirmacao';
import Dashboard from './components/Dashboard';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import './index.css';

function App() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, []);

  const fazerLogout = () => {
    setUsuario(null);
  };

  const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
    return usuario ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <HashRouter>
      <div className="w-full min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0f2b1a 0%, #1a472a 40%, #234d2c 70%, #2d6a3e 100%)' }}>
        {/* Header */}
        <header className="bg-white shadow" role="banner">
          <div className="flex items-center justify-between py-3 px-4 md:py-5 md:px-10 max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3 md:gap-5 flex-1 justify-center">
              <img
                src="https://i.ibb.co/yFHW1DxL/Gemini-CMA-logo-Photoroom.png"
                alt="Logo da Câmara Municipal de Araripe"
                className="w-10 h-10 md:w-[60px] md:h-[60px] object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="text-center">
                <h1 className="text-sm md:text-2xl font-bold text-green-800 mb-0.5 md:mb-1">Painel do Gestor - Câmara Municipal de Araripe</h1>
                <h2 className="text-xs md:text-base text-gray-700 font-normal">Gestão de documentos digitalizados</h2>
              </div>
            </div>
            {usuario && (
              <div className="flex items-center gap-3 ml-4">
                <span className="hidden md:block text-sm text-green-800 font-medium">
                  Olá, <strong>{usuario.nome?.split(' ')[0] || 'Usuário'}</strong>
                </span>
                <button
                  onClick={fazerLogout}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-sm text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
                  aria-label="Sair do sistema"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1" role="main">
          <Routes>
            <Route path="/login" element={<Login setUsuario={setUsuario} />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route
              path="/dashboard"
              element={
                <RotaProtegida>
                  <Dashboard usuario={usuario} setUsuario={setUsuario} />
                </RotaProtegida>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 md:py-5 text-center text-gray-700 mt-6 md:mt-10 text-xs md:text-base px-4" role="contentinfo">
          <p className="my-1">Copyright © 2026 | <strong>Zaqueu Fernandes</strong> | Suporte Técnico</p>
          <p className="my-1 flex items-center justify-center gap-1">
            <i className="fab fa-whatsapp text-green-500" aria-hidden="true"></i> WhatsApp:{' '}
            <a href="https://wa.me/5588994014262" target="_blank" rel="noopener noreferrer" className="text-green-800 font-bold hover:underline">
              88 9 9401-4262
            </a>
          </p>
        </footer>
        <PWAInstallPrompt />
      </div>
    </HashRouter>
  );
}

export default App;
