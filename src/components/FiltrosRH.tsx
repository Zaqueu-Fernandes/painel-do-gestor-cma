import { useState, useEffect } from 'react';
import { buscarFiltrosDisponiveisRH, buscarAnosDisponiveisRH, FiltrosRH as FiltrosRHType } from '../services/supabase';

interface FiltrosRHProps {
  filtros: FiltrosRHType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosRHType>>;
  onLimparFiltros?: () => void;
  fazerLogout: () => void;
}

const FiltrosRH = ({ filtros, setFiltros, onLimparFiltros, fazerLogout }: FiltrosRHProps) => {
  const [opcoes, setOpcoes] = useState<{
    categorias: string[];
    vinculos: string[];
    servidores: string[];
    anos: number[];
  }>({
    categorias: [],
    vinculos: [],
    servidores: [],
    anos: []
  });

  useEffect(() => {
    const carregarAnos = async () => {
      const anos = await buscarAnosDisponiveisRH();
      setOpcoes(prev => ({
        ...prev,
        anos: anos.length > 0 ? anos : [2025, 2024, 2023, 2022, 2021, 2020]
      }));
    };
    carregarAnos();
  }, []);

  useEffect(() => {
    const carregarOpcoesFiltros = async () => {
      const resultado = await buscarFiltrosDisponiveisRH(filtros);
      setOpcoes(prev => ({
        ...prev,
        categorias: resultado.categorias,
        vinculos: resultado.vinculos,
        servidores: resultado.servidores,
      }));
    };
    carregarOpcoesFiltros();
  }, [filtros.dataInicial, filtros.dataFinal, filtros.mes, filtros.ano, filtros.categoria, filtros.vinculo, filtros.servidor, filtros.docCaixa, filtros.descricao]);

  const handleChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleLimpar = () => {
    const filtrosLimpos: FiltrosRHType = {
      dataInicial: '',
      dataFinal: '',
      mes: '',
      ano: '',
      categoria: '',
      vinculo: '',
      servidor: '',
      docCaixa: '',
      descricao: ''
    };
    setFiltros(filtrosLimpos);
    if (onLimparFiltros) onLimparFiltros();
  };

  const inputClass = "w-full p-2.5 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-green-800";
  const labelClass = "block mb-1.5 text-gray-700 font-medium text-sm";

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6">
      <div className="flex justify-between items-center mb-4 md:mb-5 flex-wrap gap-3">
        <h3 className="text-green-800 text-lg md:text-xl font-bold flex items-center gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
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
          <label className={labelClass}>Categoria</label>
          <select value={filtros.categoria} onChange={(e) => handleChange('categoria', e.target.value)} className={inputClass}>
            <option value="">Todas</option>
            {opcoes.categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Vínculo</label>
          <select value={filtros.vinculo} onChange={(e) => handleChange('vinculo', e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            {opcoes.vinculos.map((v, index) => (
              <option key={index} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[900px] mx-auto">
        <div>
          <label className={labelClass}>Servidor</label>
          <select value={filtros.servidor} onChange={(e) => handleChange('servidor', e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            {opcoes.servidores.map((s, index) => (
              <option key={index} value={s}>{s}</option>
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

export default FiltrosRH;
