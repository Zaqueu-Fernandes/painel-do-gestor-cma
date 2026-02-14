import { useState, useEffect } from 'react';
import { buscarFiltrosDisponiveis, buscarAnosDisponiveis, Filtros as FiltrosType } from '../services/supabase';

interface FiltrosProps {
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
  onLimparFiltros?: () => void;
  fazerLogout: () => void;
}

const Filtros = ({ filtros, setFiltros, onLimparFiltros, fazerLogout }: FiltrosProps) => {
  const [opcoes, setOpcoes] = useState<{
    categorias: string[];
    credores: string[];
    anos: number[];
  }>({
    categorias: [],
    credores: [],
    anos: []
  });

  // Carregar anos uma vez
  useEffect(() => {
    const carregarAnos = async () => {
      const anos = await buscarAnosDisponiveis();
      setOpcoes(prev => ({
        ...prev,
        anos: anos.length > 0 ? anos : [2025, 2024, 2023, 2022, 2021, 2020]
      }));
    };
    carregarAnos();
  }, []);

  // Carregar opções de filtros dinamicamente quando filtros mudam
  useEffect(() => {
    const carregarOpcoesFiltros = async () => {
      const resultado = await buscarFiltrosDisponiveis(filtros);
      setOpcoes(prev => ({
        ...prev,
        categorias: resultado.categorias,
        credores: resultado.credores,
      }));
    };
    carregarOpcoesFiltros();
  }, [filtros.dataInicial, filtros.dataFinal, filtros.mes, filtros.ano, filtros.natureza, filtros.categoria, filtros.credor, filtros.docCaixa, filtros.descricao]);

  const handleChange = (campo: string, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleNaturezaChange = (valor: string) => {
    setFiltros(prev => ({
      ...prev,
      natureza: valor
    }));
  };

  const handleLimpar = () => {
    const filtrosLimpos: FiltrosType = {
      dataInicial: '',
      dataFinal: '',
      mes: '',
      ano: '',
      natureza: 'TODOS',
      categoria: '',
      credor: '',
      docCaixa: '',
      descricao: ''
    };
    setFiltros(filtrosLimpos);
    if (onLimparFiltros) {
      onLimparFiltros();
    }
  };

  const inputClass = "w-full p-2.5 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-green-800";
  const labelClass = "block mb-1.5 text-gray-700 font-medium text-sm";

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
        <h3 className="text-green-800 text-xl font-bold flex items-center gap-2">
          <i className="fas fa-filter"></i> Filtros
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={handleLimpar} className="px-5 py-2.5 bg-red-500 text-white rounded-md font-bold transition-colors hover:bg-red-600 flex items-center gap-1.5">
            <i className="fas fa-eraser"></i> Limpar Filtros
          </button>
          <a onClick={fazerLogout} className="text-red-500 font-bold cursor-pointer flex items-center gap-1 hover:underline">
            <i className="fas fa-sign-out-alt"></i> Sair
          </a>
        </div>
      </div>

      {/* Primeira linha */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4" style={{ gridTemplateColumns: '2.5fr 2fr 2fr 1.5fr' }}>
        <div>
          <label className={labelClass}>Período</label>
          <div className="flex gap-1.5 items-center">
            <input type="date" value={filtros.dataInicial} onChange={(e) => handleChange('dataInicial', e.target.value)} className={inputClass} />
            <span className="text-gray-700 font-medium text-sm px-0.5">até</span>
            <input type="date" value={filtros.dataFinal} onChange={(e) => handleChange('dataFinal', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Ano/Mês</label>
          <div className="flex gap-1.5">
            <select value={filtros.ano} onChange={(e) => handleChange('ano', e.target.value)} className={inputClass}>
              <option value="">Ano</option>
              {opcoes.anos.map(ano => (
                <option key={ano} value={ano}>{ano}</option>
              ))}
            </select>
            <select value={filtros.mes} onChange={(e) => handleChange('mes', e.target.value)} className={inputClass}>
              <option value="">Mês</option>
              <option value="1">Janeiro</option>
              <option value="2">Fevereiro</option>
              <option value="3">Março</option>
              <option value="4">Abril</option>
              <option value="5">Maio</option>
              <option value="6">Junho</option>
              <option value="7">Julho</option>
              <option value="8">Agosto</option>
              <option value="9">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Natureza</label>
          <div className="flex gap-1.5">
            {['TODOS', 'RECEITA', 'DESPESA'].map(val => (
              <button
                key={val}
                type="button"
                className={`flex-1 p-2.5 border-2 rounded-md cursor-pointer transition-all font-medium text-sm ${
                  filtros.natureza === val
                    ? 'bg-green-800 text-white border-green-800'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-800'
                }`}
                onClick={() => handleNaturezaChange(val)}
              >
                {val === 'TODOS' ? 'Todos' : val === 'RECEITA' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Categoria</label>
          <select value={filtros.categoria} onChange={(e) => handleChange('categoria', e.target.value)} className={inputClass}>
            <option value="">Todas</option>
            {opcoes.categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[900px] mx-auto">
        <div>
          <label className={labelClass}>Credor</label>
          <select value={filtros.credor} onChange={(e) => handleChange('credor', e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            {opcoes.credores.map((cred, index) => (
              <option key={index} value={cred}>{cred}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Doc. Caixa</label>
          <input type="text" placeholder="Buscar..." value={filtros.docCaixa} onChange={(e) => handleChange('docCaixa', e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Descrição</label>
          <input type="text" placeholder="Buscar..." value={filtros.descricao} onChange={(e) => handleChange('descricao', e.target.value)} className={inputClass} />
        </div>
      </div>
    </div>
  );
};

export default Filtros;
