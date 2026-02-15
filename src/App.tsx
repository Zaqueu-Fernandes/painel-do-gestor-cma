import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Confirmacao from './pages/Confirmacao';
import Dashboard from './components/Dashboard';
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

  const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
    return usuario ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <HashRouter>
      <div className="w-full min-h-screen" style={{ background: 'linear-gradient(135deg, #1a472a 0%, #2d5016 100%)' }}>
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-center py-5 px-10 gap-5 max-w-[1400px] mx-auto">
            <img
              src="https://i.ibb.co/yFHW1DxL/Gemini-CMA-logo-Photoroom.png"
              alt="Logo CMA"
              className="w-[60px] h-[60px] object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-800 mb-1">Painel do Gestor - Câmara Municipal de Araripe</h1>
              <h2 className="text-base text-gray-700 font-normal">Gestão de documentos digitalizados</h2>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <main>
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
        <footer className="bg-white border-t border-gray-200 py-5 text-center text-gray-700 mt-10">
          <p className="my-1">Copyright © 2026 | <strong>Zaqueu Fernandes</strong> | Suporte Técnico</p>
          <p className="my-1 flex items-center justify-center gap-1">
            <i className="fab fa-whatsapp text-green-500"></i> WhatsApp:{' '}
            <a href="https://wa.me/5588994014262" target="_blank" rel="noopener noreferrer" className="text-green-800 font-bold hover:underline">
              88 9 9401-4262
            </a>
          </p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
