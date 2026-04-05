import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Digitalizacao from './Digitalizacao';
import RecursosHumanos from './RecursosHumanos';
import AdminPanel from './AdminPanel';
import { Filtros as FiltrosType, FiltrosRH as FiltrosRHType, isAdmin, registrarLog } from '../services/supabase';

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
          className="mb-6 px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
          aria-label="Voltar aos Departamentos"
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Voltar aos Departamentos
        </button>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
        <div className="bg-green-50 rounded-full w-28 h-28 flex items-center justify-center mb-6">
          <i className="fas fa-cog fa-spin text-5xl text-green-600" aria-hidden="true"></i>
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
          aria-label="Falar no WhatsApp"
        >
          <i className="fab fa-whatsapp text-xl" aria-hidden="true"></i> Falar no WhatsApp
        </button>
      </div>
    </div>
  );
};

const Breadcrumb = ({ items }: { items: { label: string; onClick?: () => void }[] }) => (
  <nav aria-label="Navegação de trilha" className="mb-4">
    <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1.5">
          {i > 0 && <i className="fas fa-chevron-right text-[10px] text-gray-400" aria-hidden="true"></i>}
          {item.onClick ? (
            <button onClick={item.onClick} className="hover:text-green-700 transition-colors hover:underline">
              {item.label}
            </button>
          ) : (
            <span className="text-green-800 font-semibold">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

const departamentos = [
  { id: 'digitalizacao', label: 'Digitalização', icon: 'fas fa-file-alt', cor: 'from-green-700 to-green-900', descricao: 'Documentos digitalizados e análise financeira' },
  { id: 'rh', label: 'Recursos Humanos', icon: 'fas fa-users', cor: 'from-blue-700 to-blue-900', descricao: 'Folha de pagamento e dados de servidores' },
  { id: 'licitacoes', label: 'Licitações e Contratos', icon: 'fas fa-gavel', cor: 'from-amber-600 to-amber-800', descricao: 'Processos licitatórios e contratos vigentes' },
  { id: 'juridico', label: 'Jurídico', icon: 'fas fa-balance-scale', cor: 'from-red-700 to-red-900', descricao: 'Pareceres e processos jurídicos' },
  { id: 'contas', label: 'Contas de Gestão', icon: 'fas fa-chart-pie', cor: 'from-purple-700 to-purple-900', descricao: 'Prestações de contas e relatórios' },
  { id: 'pautas', label: 'Pautas Legislativas', icon: 'fas fa-landmark', cor: 'from-teal-700 to-teal-900', descricao: 'Sessões legislativas e atos normativos' },
];

const Dashboard = ({ usuario, setUsuario }: DashboardProps) => {
  const navigate = useNavigate();
  const [departamentoAtivo, setDepartamentoAtivo] = useState<string | null>(null);
  const [periodoDigitalizacao, setPeriodoDigitalizacao] = useState<'sub-2021' | 'sub-2025'>('sub-2021');

  const [filtros, setFiltros] = useState<FiltrosType>({
    dataInicial: '', dataFinal: '', mes: '', ano: '',
    natureza: 'TODOS', categoria: '', credor: '', docCaixa: '', descricao: ''
  });

  const [filtrosRH, setFiltrosRH] = useState<FiltrosRHType>({
    dataInicial: '', dataFinal: '', mes: '', ano: '',
    categoria: '', vinculo: '', servidor: '', docCaixa: '', descricao: ''
  });

  // Log de navegação ao mudar de departamento
  useEffect(() => {
    if (departamentoAtivo) {
      const depLabel = departamentoAtivo === 'admin'
        ? 'Painel Admin'
        : departamentos.find(d => d.id === departamentoAtivo)?.label || departamentoAtivo;
      registrarLog(usuario, 'navegacao', depLabel);
    }
  }, [departamentoAtivo]);

  const fazerLogout = () => {
    setUsuario(null);
    navigate('/login');
  };

  const voltarParaDepartamentos = () => {
    setDepartamentoAtivo(null);
  };

  const adminUser = isAdmin(usuario);

  // Tela principal
  if (!departamentoAtivo) {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center mb-10 animate-fade-in">
          <p className="text-gray-500 text-sm md:text-base mb-2">
            👋 Olá, <strong className="text-green-800">{usuario?.nome?.split(' ')[0] || 'Usuário'}</strong>!
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-2">Selecione o Departamento</h2>
          <p className="text-gray-500 text-sm md:text-base">Escolha uma área para acessar os dados</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-[900px] w-full animate-fade-in" role="navigation" aria-label="Departamentos disponíveis">
          {departamentos.map((dep) => (
            <button
              key={dep.id}
              onClick={() => setDepartamentoAtivo(dep.id)}
              className={`bg-gradient-to-br ${dep.cor} text-white rounded-xl p-6 md:p-8 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group`}
              aria-label={`Acessar ${dep.label}`}
            >
              <i className={`${dep.icon} text-4xl md:text-5xl opacity-90 group-hover:scale-110 transition-transform`} aria-hidden="true"></i>
              <span className="text-base md:text-lg font-bold text-center">{dep.label}</span>
              <span className="text-xs md:text-sm opacity-70 text-center leading-tight">{dep.descricao}</span>
            </button>
          ))}

          {/* Admin Card - só aparece para admin */}
          {adminUser && (
            <button
              onClick={() => setDepartamentoAtivo('admin')}
              className="bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-xl p-6 md:p-8 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer group border-2 border-amber-400/50 relative overflow-hidden"
              aria-label="Acessar Painel do Administrador"
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 text-gray-900 text-[10px] font-bold rounded-full">
                ADMIN
              </div>
              <i className="fas fa-user-shield text-4xl md:text-5xl opacity-90 group-hover:scale-110 transition-transform text-amber-300" aria-hidden="true"></i>
              <span className="text-base md:text-lg font-bold text-center">Painel Admin</span>
              <span className="text-xs md:text-sm opacity-70 text-center leading-tight">Logs de atividade e gestão de usuários</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Admin
  if (departamentoAtivo === 'admin' && adminUser) {
    return <AdminPanel usuario={usuario} onVoltar={voltarParaDepartamentos} />;
  }

  // Digitalização
  if (departamentoAtivo === 'digitalizacao') {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)] animate-fade-in">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={voltarParaDepartamentos}
                className="p-2 rounded-lg bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors shadow-sm"
                aria-label="Voltar aos Departamentos"
              >
                <i className="fas fa-arrow-left text-sm" aria-hidden="true"></i>
              </button>
              <Breadcrumb items={[
                { label: 'Departamentos', onClick: voltarParaDepartamentos },
                { label: 'Digitalização' }
              ]} />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
              <button
                onClick={() => setPeriodoDigitalizacao('sub-2021')}
                className={`px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  periodoDigitalizacao === 'sub-2021'
                    ? 'bg-green-700 text-white shadow-md'
                    : 'text-gray-500 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <i className="fas fa-calendar-alt text-[10px]" aria-hidden="true"></i> 2021–2024
              </button>
              <button
                onClick={() => setPeriodoDigitalizacao('sub-2025')}
                className={`px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  periodoDigitalizacao === 'sub-2025'
                    ? 'bg-green-700 text-white shadow-md'
                    : 'text-gray-500 hover:text-green-700 hover:bg-green-50'
                }`}
              >
                <i className="fas fa-calendar-plus text-[10px]" aria-hidden="true"></i> 2025+
              </button>
            </div>
          </div>
        </div>
        <Digitalizacao fazerLogout={fazerLogout} filtros={filtros} setFiltros={setFiltros} periodo={periodoDigitalizacao} />
      </div>
    );
  }

  // RH
  if (departamentoAtivo === 'rh') {
    return (
      <div className="bg-gray-50 min-h-[calc(100vh-200px)] animate-fade-in">
        <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
          <Breadcrumb items={[
            { label: 'Departamentos', onClick: voltarParaDepartamentos },
            { label: 'Recursos Humanos' }
          ]} />
          <button
            onClick={voltarParaDepartamentos}
            className="mb-4 px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
            aria-label="Voltar aos Departamentos"
          >
            <i className="fas fa-arrow-left" aria-hidden="true"></i> Voltar aos Departamentos
          </button>
        </div>
        <RecursosHumanos fazerLogout={fazerLogout} filtrosRH={filtrosRH} setFiltrosRH={setFiltrosRH} />
      </div>
    );
  }

  return <PaginaEmDesenvolvimento onVoltar={voltarParaDepartamentos} />;
};

export default Dashboard;
