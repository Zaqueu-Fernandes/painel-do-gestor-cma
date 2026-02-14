import { useState, useEffect } from 'react';
import { buscarDadosGraficos, Filtros as FiltrosType } from '../services/supabase';
import Filtros from './Filtros';
import Graficos from './Graficos';
import jsPDF from 'jspdf';

interface AnaliseFinanceiraProps {
  fazerLogout: () => void;
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
}

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
};

const AnaliseFinanceira = ({ fazerLogout, filtros, setFiltros }: AnaliseFinanceiraProps) => {
  const [dadosGraficos, setDadosGraficos] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [semDados, setSemDados] = useState(false);

  useEffect(() => {
    carregarDadosGraficos();
  }, [filtros]);

  const carregarDadosGraficos = async () => {
    setLoading(true);
    setSemDados(false);

    try {
      const resultado = await buscarDadosGraficos(filtros);

      if (resultado.sucesso) {
        setDadosGraficos(resultado);
      } else {
        setSemDados(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados gráficos:', error);
      setSemDados(true);
    } finally {
      setLoading(false);
    }
  };

  const nomeMes = (mes: string) => {
    const meses: Record<string, string> = {
      '1': 'Janeiro', '2': 'Fevereiro', '3': 'Março', '4': 'Abril',
      '5': 'Maio', '6': 'Junho', '7': 'Julho', '8': 'Agosto',
      '9': 'Setembro', '10': 'Outubro', '11': 'Novembro', '12': 'Dezembro'
    };
    return meses[mes] || mes;
  };

  const gerarTextoFiltros = () => {
    const partes: string[] = [];
    if (filtros.dataInicial && filtros.dataFinal) {
      partes.push(`Período: ${new Date(filtros.dataInicial).toLocaleDateString('pt-BR')} a ${new Date(filtros.dataFinal).toLocaleDateString('pt-BR')}`);
    } else {
      if (filtros.ano) partes.push(`Ano: ${filtros.ano}`);
      if (filtros.mes) partes.push(`Mês: ${nomeMes(filtros.mes)}`);
    }
    if (filtros.natureza && filtros.natureza !== 'TODOS') partes.push(`Natureza: ${filtros.natureza}`);
    if (filtros.categoria) partes.push(`Categoria: ${filtros.categoria}`);
    if (filtros.credor) partes.push(`Credor: ${filtros.credor}`);
    if (filtros.docCaixa) partes.push(`Doc. Caixa: ${filtros.docCaixa}`);
    if (filtros.descricao) partes.push(`Descrição: ${filtros.descricao}`);
    return partes;
  };

  const exportarPDF = () => {
    if (!dadosGraficos) return;
    
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Câmara Municipal de Araripe', 148, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Análise Financeira', 148, 23, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    // Filtros aplicados
    let y = 34;
    const filtrosTexto = gerarTextoFiltros();
    if (filtrosTexto.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros aplicados:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const linhaFiltros = filtrosTexto.join('  |  ');
      doc.text(linhaFiltros, 14, y);
      y += 8;
      doc.setLineWidth(0.2);
      doc.line(14, y, 283, y);
      y += 6;
    } else {
      y = 40;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro:', 14, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.text(`Receitas: ${formatarMoeda(dadosGraficos.totais.receitas)}`, 14, y);
    y += 8;
    doc.text(`Despesa Bruta: ${formatarMoeda(dadosGraficos.totais.despesaBruta)}`, 14, y);
    y += 8;
    doc.text(`Deduções: ${formatarMoeda(dadosGraficos.totais.deducoes)}`, 14, y);
    y += 8;
    doc.text(`Despesa Líquida: ${formatarMoeda(dadosGraficos.totais.despesaLiquida)}`, 14, y);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.text('Top 10 Credores:', 14, y);
    y += 10;

    doc.setFont('helvetica', 'normal');
    dadosGraficos.top10Credores.forEach(([credor, valor]: [string, number], index: number) => {
      doc.text(`${index + 1}. ${credor}: ${formatarMoeda(valor)}`, 14, y);
      y += 8;
      if (y > 180) {
        doc.addPage();
        y = 20;
      }
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.line(14, 195, 283, 195);
      doc.text(
        'Copyright © 2026 | Zaqueu Fernandes | Suporte: 88 9 9401-4262',
        148,
        202,
        { align: 'center' }
      );
    }

    doc.save(`analise-financeira-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        fazerLogout={fazerLogout}
      />

      {loading && (
        <div className="text-center py-16 text-gray-700">
          <i className="fas fa-spinner fa-spin text-5xl text-green-800 mb-4"></i>
          <p className="text-lg">Gerando gráficos...</p>
        </div>
      )}

      {!loading && semDados && (
        <div className="text-center py-16 text-gray-700">
          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
          <p className="text-lg">Nenhum dado encontrado na base</p>
        </div>
      )}

      {!loading && !semDados && dadosGraficos && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-green-800 text-xl font-bold flex items-center gap-2">
              <i className="fas fa-chart-pie"></i> Análise Gráfica
            </h3>
            <button onClick={exportarPDF} className="px-5 py-2.5 bg-green-800 text-white rounded-md font-bold transition-colors hover:bg-green-700 flex items-center gap-2">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
          <Graficos dadosGraficos={dadosGraficos} />
        </>
      )}
    </div>
  );
};

export default AnaliseFinanceira;
