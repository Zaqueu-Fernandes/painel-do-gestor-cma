import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Digitalizacao from './Digitalizacao';
import RecursosHumanos from './RecursosHumanos';
import { Filtros as FiltrosType, FiltrosRH as FiltrosRHType } from '../services/supabase';

interface DashboardProps {
  usuario: any;
  setUsuario: (u: any) => void;
}

const PaginaEmDesenvolvimento = ({ onVoltar }: { onVoltar: () => void }) => {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] flex flex-col">
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <button
          onClick={onVoltar}
          className="mb-6 px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-arrow-left"></i> Voltar aos Departamentos
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
        <div className="text-green-800 mb-6">
          <i className="fas fa-cog fa-spin text-7xl"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-3 text-center">
          Esta página está em processo de desenvolvimento
        </h2>
        <p className="text-gray-500 text-sm md:text-base text-center max-w-md mb-6">
          Em breve estará disponível. Em caso de dúvidas, entre em contato com o desenvolvedor.
        </p>
        <button
          onClick={() => window.open('https://wa.me/5588994014262', '_blank')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md"
        >
          <i className="fab fa-whatsapp text-xl"></i> Falar no WhatsApp
        </button>
      </div>
    </div>
  );
};

const departamentos = [
  { id: 'digitalizacao', label: 'Digitalização', icon: 'fas fa-file-alt', cor: 'from-green-700 to-green-900' },
  { id: 'rh', label: 'Recursos Humanos', icon: 'fas fa-users', cor: 'from-blue-700 to-blue-900' },
  { id: 'licitacoes', label: 'Licitações e Contratos', icon: 'fas fa-gavel', cor: 'from-amber-600 to-amber-800' },
  { id: 'juridico', label: 'Jurídico', icon: 'fas fa-balance-scale', cor: 'from-red-700 to-red-900' },
  { id: 'contas', label: 'Contas de Gestão', icon: 'fas fa-chart-pie', cor: 'from-purple-700 to-purple-900' },
  { id: 'pautas', label: 'Pautas Legislativas', icon: 'fas fa-landmark', cor: 'from-teal-700 to-teal-900' },
];

const Dashboard = ({ usuario, setUsuario }: DashboardProps) => {
  const navigate = useNavigate();
  const [departamentoAtivo, setDepartamentoAtivo] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosType>({
    dataInicial: '',
    dataFinal: '',
    mes: '',
    ano: '',
    natureza: 'TODOS',
    categoria: '',
    credor: '',
    docCaixa: '',
    descricao: ''
  });

  const [filtrosRH, setFiltrosRH] = useState<FiltrosRHType>({
    dataInicial: '',
    dataFinal: '',
    mes: '',
    ano: '',
    categoria: '',
    vinculo: '',
    servidor: '',
    docCaixa: '',
    descricao: ''
  });

  const fazerLogout = () => {
    setUsuario(null);
    navigate('/login');
  };

  const voltarParaDepartamentos = () => {
    setDepartamentoAtivo(null);
  };

  // Tela principal: seleção de departamentos
  if (!departamentoAtivo) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">Selecione o Departamento</h2>
          <p className="text-gray-500 text-sm md:text-base">Escolha uma área para acessar os dados</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-[900px] w-full animate-fade-in">
          {departamentos.map((dep) => (
            <button
              key={dep.id}
              onClick={() => setDepartamentoAtivo(dep.id)}
              className={`bg-gradient-to-br ${dep.cor} text-white rounded-xl p-6 md:p-8 flex flex-col items-center gap-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer`}
            >
              <i className={`${dep.icon} text-4xl md:text-5xl opacity-90`}></i>
              <span className="text-base md:text-lg font-bold text-center">{dep.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={fazerLogout}
          className="mt-10 px-6 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <i className="fas fa-sign-out-alt"></i> Sair
        </button>
      </div>
    );
  }

  // Departamentos com conteúdo implementado
  if (departamentoAtivo === 'digitalizacao') {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <button
            onClick={voltarParaDepartamentos}
            className="mb-4 px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Voltar aos Departamentos
          </button>
        </div>
        <Digitalizacao fazerLogout={fazerLogout} filtros={filtros} setFiltros={setFiltros} />
      </div>
    );
  }

  if (departamentoAtivo === 'rh') {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <button
            onClick={voltarParaDepartamentos}
            className="mb-4 px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <i className="fas fa-arrow-left"></i> Voltar aos Departamentos
          </button>
        </div>
        <RecursosHumanos fazerLogout={fazerLogout} filtrosRH={filtrosRH} setFiltrosRH={setFiltrosRH} />
      </div>
    );
  }

  // Departamentos em desenvolvimento
  return <PaginaEmDesenvolvimento onVoltar={voltarParaDepartamentos} />;
};

export default Dashboard;
