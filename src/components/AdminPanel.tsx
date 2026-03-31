import { useState, useEffect } from 'react';
import { buscarLogs, buscarUsuarios, LogAtividade } from '../services/supabase';

interface AdminPanelProps {
  usuario: any;
  onVoltar: () => void;
}

interface SessionGroup {
  sessionId: string;
  email: string;
  nome: string;
  login?: string;
  logout?: string;
  telas: string[];
  duracao: string;
}

const AdminPanel = ({ usuario, onVoltar }: AdminPanelProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'sessoes' | 'logs' | 'usuarios'>('sessoes');
  const [filtroEmail, setFiltroEmail] = useState('');
  const [filtroDataInicial, setFiltroDataInicial] = useState('');
  const [filtroDataFinal, setFiltroDataFinal] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    const [logsRes, usersRes] = await Promise.all([
      buscarLogs({
        email: filtroEmail || undefined,
        dataInicial: filtroDataInicial || undefined,
        dataFinal: filtroDataFinal || undefined,
        tipo: filtroTipo || undefined,
      }),
      buscarUsuarios(),
    ]);
    setLogs(logsRes.dados);
    setUsuarios(usersRes.dados);
    setLoading(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const aplicarFiltros = () => {
    carregarDados();
  };

  const limparFiltros = () => {
    setFiltroEmail('');
    setFiltroDataInicial('');
    setFiltroDataFinal('');
    setFiltroTipo('');
    setTimeout(() => carregarDados(), 100);
  };

  // Agrupar logs por sessão
  const sessoes: SessionGroup[] = (() => {
    const groups: Record<string, SessionGroup> = {};

    logs.forEach((log: any) => {
      const sid = log.session_id || 'sem-sessao';
      if (!groups[sid]) {
        groups[sid] = {
          sessionId: sid,
          email: log.user_email,
          nome: log.user_nome,
          telas: [],
          duracao: '-',
        };
      }
      const g = groups[sid];
      if (log.tipo === 'login') g.login = log.created_at;
      if (log.tipo === 'logout') g.logout = log.created_at;
      if (log.tipo === 'navegacao' && !g.telas.includes(log.tela)) {
        g.telas.push(log.tela);
      }
    });

    // Calcular duração
    Object.values(groups).forEach(g => {
      if (g.login) {
        const end = g.logout ? new Date(g.logout) : new Date();
        const start = new Date(g.login);
        const diffMs = end.getTime() - start.getTime();
        const mins = Math.floor(diffMs / 60000);
        const hrs = Math.floor(mins / 60);
        const remainMins = mins % 60;
        g.duracao = g.logout
          ? `${hrs}h ${remainMins}min`
          : `${hrs}h ${remainMins}min (ativo)`;
      }
    });

    return Object.values(groups).sort((a, b) => {
      const da = a.login || '';
      const db = b.login || '';
      return db.localeCompare(da);
    });
  })();

  const formatDate = (d: string) => {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };

  const tipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'login': return 'fas fa-sign-in-alt text-green-600';
      case 'logout': return 'fas fa-sign-out-alt text-red-500';
      case 'navegacao': return 'fas fa-compass text-blue-500';
      default: return 'fas fa-circle text-gray-400';
    }
  };

  const tipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'login': return 'bg-green-100 text-green-700 border-green-200';
      case 'logout': return 'bg-red-100 text-red-700 border-red-200';
      case 'navegacao': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] animate-fade-in">
      <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 flex items-center gap-3">
              <i className="fas fa-user-shield" aria-hidden="true"></i>
              Painel do Administrador
            </h2>
            <p className="text-gray-500 text-sm mt-1">Gerencie usuários e monitore atividades do sistema</p>
          </div>
          <button
            onClick={onVoltar}
            className="px-5 py-2.5 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-sm"
            aria-label="Voltar aos Departamentos"
          >
            <i className="fas fa-arrow-left" aria-hidden="true"></i> Voltar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-green-600" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
                <p className="text-xs text-gray-500">Usuários</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clipboard-list text-blue-600" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{logs.length}</p>
                <p className="text-xs text-gray-500">Registros</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-sign-in-alt text-amber-600" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{sessoes.length}</p>
                <p className="text-xs text-gray-500">Sessões</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-check text-emerald-600" aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{usuarios.filter(u => u.status).length}</p>
                <p className="text-xs text-gray-500">Ativos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'sessoes' as const, label: 'Sessões', icon: 'fas fa-clock' },
            { id: 'logs' as const, label: 'Logs Detalhados', icon: 'fas fa-list' },
            { id: 'usuarios' as const, label: 'Usuários', icon: 'fas fa-users' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                abaAtiva === tab.id
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <i className={tab.icon} aria-hidden="true"></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filtros */}
        {(abaAtiva === 'sessoes' || abaAtiva === 'logs') && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <i className="fas fa-filter text-green-600" aria-hidden="true"></i> Filtros
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Usuário</label>
                <select
                  value={filtroEmail}
                  onChange={e => setFiltroEmail(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600"
                >
                  <option value="">Todos</option>
                  {usuarios.map((u: any) => (
                    <option key={u.email} value={u.email}>{u.nome} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={filtroDataInicial}
                  onChange={e => setFiltroDataInicial(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data Final</label>
                <input
                  type="date"
                  value={filtroDataFinal}
                  onChange={e => setFiltroDataFinal(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                <select
                  value={filtroTipo}
                  onChange={e => setFiltroTipo(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-600"
                >
                  <option value="">Todos</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="navegacao">Navegação</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={aplicarFiltros}
                className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
              >
                <i className="fas fa-search mr-1.5" aria-hidden="true"></i> Buscar
              </button>
              <button
                onClick={limparFiltros}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-eraser mr-1.5" aria-hidden="true"></i> Limpar
              </button>
              <button
                onClick={carregarDados}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-sync-alt mr-1.5" aria-hidden="true"></i> Atualizar
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Sessões */}
            {abaAtiva === 'sessoes' && (
              <div className="space-y-3">
                {sessoes.length === 0 ? (
                  <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center">
                    <i className="fas fa-inbox text-4xl text-gray-300 mb-3" aria-hidden="true"></i>
                    <p className="text-gray-500">Nenhuma sessão registrada ainda</p>
                    <p className="text-gray-400 text-sm mt-1">Os logs aparecerão aqui após a criação da tabela no Supabase</p>
                  </div>
                ) : (
                  sessoes.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-user text-green-700" aria-hidden="true"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{s.nome}</p>
                            <p className="text-xs text-gray-500">{s.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                            <i className="fas fa-sign-in-alt mr-1" aria-hidden="true"></i>
                            {formatDate(s.login || '')}
                          </span>
                          {s.logout ? (
                            <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full border border-red-200">
                              <i className="fas fa-sign-out-alt mr-1" aria-hidden="true"></i>
                              {formatDate(s.logout)}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200 animate-pulse">
                              <i className="fas fa-circle text-[8px] mr-1" aria-hidden="true"></i>
                              Online
                            </span>
                          )}
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                            <i className="fas fa-clock mr-1" aria-hidden="true"></i>
                            {s.duracao}
                          </span>
                        </div>
                      </div>
                      {s.telas.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-1.5">
                            <i className="fas fa-route mr-1" aria-hidden="true"></i> Telas visitadas:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {s.telas.map((t, j) => (
                              <span key={j} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Logs Detalhados */}
            {abaAtiva === 'logs' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-600">Data/Hora</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Usuário</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Tipo</th>
                        <th className="text-left p-3 font-semibold text-gray-600">Tela</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-10 text-center text-gray-400">
                            <i className="fas fa-inbox text-3xl mb-2 block" aria-hidden="true"></i>
                            Nenhum log encontrado
                          </td>
                        </tr>
                      ) : (
                        logs.map((log: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="p-3 text-gray-700 whitespace-nowrap">{formatDate(log.created_at)}</td>
                            <td className="p-3">
                              <p className="font-medium text-gray-800">{log.user_nome}</p>
                              <p className="text-xs text-gray-400">{log.user_email}</p>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tipoBadge(log.tipo)}`}>
                                <i className={tipoIcon(log.tipo)} aria-hidden="true"></i>
                                {log.tipo}
                              </span>
                            </td>
                            <td className="p-3 text-gray-600">{log.tela || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Usuários */}
            {abaAtiva === 'usuarios' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {usuarios.map((u: any) => (
                  <div key={u.id || u.email} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.status ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <i className={`fas fa-user ${u.status ? 'text-green-600' : 'text-gray-400'}`} aria-hidden="true"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{u.nome}</p>
                        <p className="text-xs text-gray-500">{u.cargo || 'Sem cargo'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      <i className="fas fa-envelope mr-1" aria-hidden="true"></i> {u.email}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.status
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      <i className={`fas ${u.status ? 'fa-check-circle' : 'fa-clock'}`} aria-hidden="true"></i>
                      {u.status ? 'Ativo' : 'Pendente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
