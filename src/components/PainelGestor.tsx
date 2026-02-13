import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { exportToPDF } from '../utils/exportPDF';

const PainelGestor = () => {
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('base').select('*');
      if (!error) {
        setDados(data || []);
      } else {
        console.error("Erro ao buscar dados:", error);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const totais = dados.reduce((acc, curr) => ({
    receitas: acc.receitas + (Number(curr.receitas) || 0),
    bruta: acc.bruta + (Number(curr.despesa_bruta) || 0),
    deducoes: acc.deducoes + (Number(curr.deducoes) || 0),
    liquida: acc.liquida + (Number(curr.despesa_liquida) || 0),
  }), { receitas: 0, bruta: 0, deducoes: 0, liquida: 0 });

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-20">
      <i className="fa-solid fa-spinner fa-spin text-4xl text-green-700"></i>
      <p className="mt-4 text-green-800 font-bold animate-pulse">Buscando dados na base...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-8 border-green-600">
          <p className="text-xs font-bold text-gray-400 uppercase">Receitas</p>
          <p className="text-xl font-black text-green-700">R$ {totais.receitas.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-8 border-red-500">
          <p className="text-xs font-bold text-gray-400 uppercase">Despesa Bruta</p>
          <p className="text-xl font-black text-red-600">R$ {totais.bruta.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-8 border-orange-400">
          <p className="text-xs font-bold text-gray-400 uppercase">Deduções</p>
          <p className="text-xl font-black text-orange-600">R$ {totais.deducoes.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border-l-8 border-blue-600">
          <p className="text-xs font-bold text-gray-400 uppercase">Despesa Líquida</p>
          <p className="text-xl font-black text-blue-700">R$ {totais.liquida.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-green-800 font-bold uppercase text-sm tracking-widest">
          <i className="fa-solid fa-list-check mr-2"></i> Documentos Digitalizados
        </h3>
        <button 
          onClick={() => exportToPDF(dados, "Listagem de Documentos Digitalizados - CMA")}
          className="bg-red-600 text-white px-5 py-2 rounded-md font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-md active:scale-95"
        >
          <i className="fa-solid fa-file-pdf"></i> Exportar PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-700 text-white uppercase text-xs">
              <tr>
                <th className="p-4 font-bold">Data</th>
                <th className="p-4 font-bold">Doc. Caixa</th>
                <th className="p-4 font-bold">Credor</th>
                <th className="p-4 font-bold">Categoria</th>
                <th className="p-4 font-bold">Vlr Líquido</th>
                <th className="p-4 font-bold text-center">Processo</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {dados.length > 0 ? (
                dados.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                    <td className="p-4 whitespace-nowrap">{item.data}</td>
                    <td className="p-4">{item.doc_caixa}</td>
                    <td className="p-4 font-semibold uppercase">{item.credor}</td>
                    <td className="p-4">{item.categoria}</td>
                    <td className="p-4 text-red-600 font-bold">
                      R$ {Number(item.despesa_liquida).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-4 text-center">
                      {item.processo ? (
                        <a 
                          href={item.processo} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block p-2 text-green-700 hover:bg-green-100 rounded-full transition-all hover:scale-125"
                          title="Ver Documento"
                        >
                          <i className="fa-solid fa-paperclip text-lg"></i>
                        </a>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                    Nenhum dado encontrado na base do Supabase.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PainelGestor;
