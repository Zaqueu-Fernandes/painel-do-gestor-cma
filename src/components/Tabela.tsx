import { useState, useEffect } from 'react';

interface TabelaProps {
  dados: any[];
}

const Tabela = ({ dados }: TabelaProps) => {
  const [dadosOrdenados, setDadosOrdenados] = useState<any[]>([]);
  const [ordenacao, setOrdenacao] = useState({ coluna: 'data', ordem: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

  useEffect(() => {
    ordenarDados(dados, ordenacao.coluna, ordenacao.ordem);
  }, [dados]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR');
  };

  const ordenarDados = (dados: any[], coluna: string, ordem: string) => {
    const dadosClone = [...dados];

    dadosClone.sort((a, b) => {
      let valorA = a[coluna];
      let valorB = b[coluna];

      if (coluna === 'data') {
        valorA = new Date(valorA);
        valorB = new Date(valorB);
      }

      if (ordem === 'asc') {
        return valorA > valorB ? 1 : -1;
      } else {
        return valorA < valorB ? 1 : -1;
      }
    });

    setDadosOrdenados(dadosClone);
    setPaginaAtual(1);
  };

  const handleOrdenar = (coluna: string) => {
    const novaOrdem = ordenacao.coluna === coluna && ordenacao.ordem === 'asc' ? 'desc' : 'asc';
    setOrdenacao({ coluna, ordem: novaOrdem });
    ordenarDados(dadosOrdenados, coluna, novaOrdem);
  };

  // Paginação
  const totalPaginas = Math.ceil(dadosOrdenados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const dadosPagina = dadosOrdenados.slice(inicio, fim);

  const mudarPagina = (novaPagina: number) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const renderPaginacao = () => {
    if (totalPaginas <= 1) return null;

    const maxBotoes = 5;
    let inicioBtn = Math.max(1, paginaAtual - Math.floor(maxBotoes / 2));
    let fimBtn = Math.min(totalPaginas, inicioBtn + maxBotoes - 1);

    if (fimBtn - inicioBtn < maxBotoes - 1) {
      inicioBtn = Math.max(1, fimBtn - maxBotoes + 1);
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-5">
        <button
          onClick={() => mudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
          className="px-3 py-2 border border-gray-200 bg-white rounded-md cursor-pointer transition-all min-w-[40px] hover:bg-green-800 hover:text-white hover:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200"
        >
          <i className="fas fa-chevron-left"></i>
        </button>

        {inicioBtn > 1 && (
          <>
            <button onClick={() => mudarPagina(1)} className="px-3 py-2 border border-gray-200 bg-white rounded-md cursor-pointer transition-all min-w-[40px] hover:bg-green-800 hover:text-white hover:border-green-800">1</button>
            {inicioBtn > 2 && <span className="px-2 text-gray-700">...</span>}
          </>
        )}

        {Array.from({ length: fimBtn - inicioBtn + 1 }, (_, i) => inicioBtn + i).map((num) => (
          <button
            key={num}
            onClick={() => mudarPagina(num)}
            className={`px-3 py-2 border rounded-md cursor-pointer transition-all min-w-[40px] ${
              paginaAtual === num
                ? 'bg-green-800 text-white border-green-800'
                : 'border-gray-200 bg-white hover:bg-green-800 hover:text-white hover:border-green-800'
            }`}
          >
            {num}
          </button>
        ))}

        {fimBtn < totalPaginas && (
          <>
            {fimBtn < totalPaginas - 1 && <span className="px-2 text-gray-700">...</span>}
            <button onClick={() => mudarPagina(totalPaginas)} className="px-3 py-2 border border-gray-200 bg-white rounded-md cursor-pointer transition-all min-w-[40px] hover:bg-green-800 hover:text-white hover:border-green-800">{totalPaginas}</button>
          </>
        )}

        <button
          onClick={() => mudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
          className="px-3 py-2 border border-gray-200 bg-white rounded-md cursor-pointer transition-all min-w-[40px] hover:bg-green-800 hover:text-white hover:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="bg-white rounded-xl overflow-hidden shadow max-h-[600px] overflow-y-auto">
        <table className="w-full border-collapse text-sm min-w-[1200px]">
          <thead className="bg-green-800 text-white sticky top-0 z-10">
            <tr>
              {[
                { key: 'data', label: 'Data' },
                { key: 'doc_caixa', label: 'Doc. Caixa' },
                { key: 'natureza', label: 'Natureza' },
                { key: 'categoria', label: 'Categoria' },
                { key: 'credor', label: 'Credor' },
                { key: 'descricao', label: 'Descrição' },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleOrdenar(col.key)}
                  className="p-3.5 text-left font-semibold cursor-pointer whitespace-nowrap hover:bg-green-700"
                >
                  {col.label} <i className="fas fa-sort ml-1 text-xs"></i>
                </th>
              ))}
              <th className="p-3.5 text-left font-semibold">Receitas</th>
              <th className="p-3.5 text-left font-semibold">Desp. Bruta</th>
              <th className="p-3.5 text-left font-semibold">Deduções</th>
              <th className="p-3.5 text-left font-semibold">Desp. Líquida</th>
              <th className="p-3.5 text-left font-semibold">Processo</th>
            </tr>
          </thead>
          <tbody>
            {dadosPagina.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                <td className="p-3">{formatarData(item.data)}</td>
                <td className="p-3">{item.doc_caixa || '-'}</td>
                <td className="p-3">{item.natureza || '-'}</td>
                <td className="p-3">{item.categoria || '-'}</td>
                <td className="p-3">{item.credor || '-'}</td>
                <td className="p-3">{item.descricao || '-'}</td>
                <td className="p-3">{formatarMoeda(item.receitas)}</td>
                <td className="p-3">{formatarMoeda(item.despesa_bruta)}</td>
                <td className="p-3">{formatarMoeda(item.deducoes)}</td>
                <td className="p-3">{formatarMoeda(item.despesa_liquida)}</td>
                <td className="p-3">
                  {item.processo ? (
                    <a
                      href={item.processo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 cursor-pointer transition-colors hover:text-blue-700"
                    >
                      <i className="fas fa-paperclip"></i>
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPaginacao()}
    </div>
  );
};

export default Tabela;
