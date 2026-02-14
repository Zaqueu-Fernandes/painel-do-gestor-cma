import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Digitalizacao from './Digitalizacao';
import AnaliseFinanceira from './AnaliseFinanceira';
import { Filtros as FiltrosType } from '../services/supabase';

interface DashboardProps {
  usuario: any;
  setUsuario: (u: any) => void;
}

const Dashboard = ({ usuario, setUsuario }: DashboardProps) => {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('digitalizacao');

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

  const fazerLogout = () => {
    setUsuario(null);
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
      {/* Menu Abas */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex px-10 max-w-[1400px] mx-auto">
          <button
            className={`py-4 px-8 bg-transparent border-b-[3px] text-base font-medium cursor-pointer transition-all flex items-center gap-2 ${
              abaAtiva === 'digitalizacao'
                ? 'border-green-800 text-green-800'
                : 'border-transparent text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setAbaAtiva('digitalizacao')}
          >
            <i className="fas fa-file-alt"></i> Digitalização
          </button>
          <button
            className={`py-4 px-8 bg-transparent border-b-[3px] text-base font-medium cursor-pointer transition-all flex items-center gap-2 ${
              abaAtiva === 'analise'
                ? 'border-green-800 text-green-800'
                : 'border-transparent text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setAbaAtiva('analise')}
          >
            <i className="fas fa-chart-bar"></i> Análise Financeira
          </button>
        </div>
      </div>

      {/* Conteúdo das Abas */}
      {abaAtiva === 'digitalizacao' && (
        <Digitalizacao
          fazerLogout={fazerLogout}
          filtros={filtros}
          setFiltros={setFiltros}
        />
      )}
      {abaAtiva === 'analise' && (
        <AnaliseFinanceira
          fazerLogout={fazerLogout}
          filtros={filtros}
          setFiltros={setFiltros}
        />
      )}
    </div>
  );
};

export default Dashboard;
