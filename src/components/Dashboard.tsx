import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Digitalizacao from './Digitalizacao';
import AnaliseFinanceira from './AnaliseFinanceira';
import RecursosHumanos from './RecursosHumanos';
import { Filtros as FiltrosType, FiltrosRH as FiltrosRHType } from '../services/supabase';

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

  const abas = [
    { id: 'digitalizacao', label: 'Digitalização', icon: 'fas fa-file-alt' },
    { id: 'analise', label: 'Análise Financeira', icon: 'fas fa-chart-bar' },
    { id: 'rh', label: 'Recursos Humanos', icon: 'fas fa-users' },
  ];

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)]">
      <div className="bg-white border-t border-gray-200">
        <div className="flex px-4 md:px-10 max-w-[1400px] mx-auto overflow-x-auto">
          {abas.map(aba => (
            <button
              key={aba.id}
              className={`py-3 md:py-4 px-4 md:px-8 bg-transparent border-b-[3px] text-sm md:text-base font-medium cursor-pointer transition-all flex items-center gap-2 whitespace-nowrap ${
                abaAtiva === aba.id
                  ? 'border-green-800 text-green-800'
                  : 'border-transparent text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              <i className={aba.icon}></i> {aba.label}
            </button>
          ))}
        </div>
      </div>

      {abaAtiva === 'digitalizacao' && (
        <Digitalizacao fazerLogout={fazerLogout} filtros={filtros} setFiltros={setFiltros} />
      )}
      {abaAtiva === 'analise' && (
        <AnaliseFinanceira fazerLogout={fazerLogout} filtros={filtros} setFiltros={setFiltros} />
      )}
      {abaAtiva === 'rh' && (
        <RecursosHumanos fazerLogout={fazerLogout} filtrosRH={filtrosRH} setFiltrosRH={setFiltrosRH} />
      )}
    </div>
  );
};

export default Dashboard;
