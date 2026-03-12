import { useState, useEffect } from 'react';
import { buscarDadosRH, FiltrosRH as FiltrosRHType, TotaisRH } from '../services/supabase';
import FiltrosRH from './FiltrosRH';
import CardsRH from './CardsRH';
import TabelaRH from './TabelaRH';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RecursosHumanosProps {
  fazerLogout: () => void;
  filtrosRH: FiltrosRHType;
  setFiltrosRH: React.Dispatch<React.SetStateAction<FiltrosRHType>>;
}

const RecursosHumanos = ({ fazerLogout, filtrosRH, setFiltrosRH }: RecursosHumanosProps) => {
  const [dados, setDados] = useState<any[]>([]);
  const [totais, setTotais] = useState<TotaisRH>({ valorBruto: 0, deducoes: 0, valorLiquido: 0 });
  const [loading, setLoading] = useState(true);
  const [semDados, setSemDados] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [filtrosRH]);

  const carregarDados = async () => {
    setLoading(true);
    setSemDados(false);
    try {
      const resultado = await buscarDadosRH(filtrosRH);
      if (resultado.sucesso) {
        setDados(resultado.dados);
        setTotais(resultado.totais);
        if (resultado.dados.length === 0) setSemDados(true);
      } else {
        setSemDados(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados RH:', error);
      setSemDados(true);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
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
    if (filtrosRH.dataInicial && filtrosRH.dataFinal) {
      partes.push(`Período: ${new Date(filtrosRH.dataInicial).toLocaleDateString('pt-BR')} a ${new Date(filtrosRH.dataFinal).toLocaleDateString('pt-BR')}`);
    } else {
      if (filtrosRH.ano) partes.push(`Ano: ${filtrosRH.ano}`);
      if (filtrosRH.mes) partes.push(`Mês: ${nomeMes(filtrosRH.mes)}`);
    }
    if (filtrosRH.categoria) partes.push(`Categoria: ${filtrosRH.categoria}`);
    if (filtrosRH.vinculo) partes.push(`Vínculo: ${filtrosRH.vinculo}`);
    if (filtrosRH.servidor) partes.push(`Servidor: ${filtrosRH.servidor}`);
    if (filtrosRH.docCaixa) partes.push(`Doc. Caixa: ${filtrosRH.docCaixa}`);
    if (filtrosRH.descricao) partes.push(`Descrição: ${filtrosRH.descricao}`);
    return partes;
  };

  const exportarPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Câmara Municipal de Araripe', 148, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Recursos Humanos', 148, 23, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(14, 28, 283, 28);

    let y = 34;
    const filtrosTexto = gerarTextoFiltros();
    if (filtrosTexto.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Filtros aplicados:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(filtrosTexto.join('  |  '), 14, y);
      y += 8;
      doc.setLineWidth(0.2);
      doc.line(14, y, 283, y);
      y += 4;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotais:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Valor Bruto: ${formatarMoeda(totais.valorBruto)}  |  Deduções: ${formatarMoeda(totais.deducoes)}  |  Valor Líquido: ${formatarMoeda(totais.valorLiquido)}`, 14, y);
    y += 8;
    doc.setLineWidth(0.2);
    doc.line(14, y, 283, y);
    y += 4;

    const dadosTabela = dados.map((item) => [
      new Date(item.data).toLocaleDateString('pt-BR'),
      item.doc_caixa || '-',
      item.mes_competencia || '-',
      item.categoria || '-',
      item.vinculo || '-',
      item.servidor || '-',
      item.descricao || '-',
      formatarMoeda(item.valor_bruto),
      formatarMoeda(item.deducoes),
      formatarMoeda(item.valor_liquido),
      item.anexo ? 'Link' : '-'
    ]);

    autoTable(doc, {
      head: [['Data', 'Doc. Caixa', 'Competência', 'Categoria', 'Vínculo', 'Servidor', 'Descrição', 'Val. Bruto', 'Deduções', 'Val. Líquido', 'Anexo']],
      body: dadosTabela,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [45, 80, 22] },
      styles: { fontSize: 8 },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 10 && data.cell.raw === 'Link') {
          const anexo = dados[data.row.index]?.anexo;
          if (anexo) {
            doc.setTextColor(0, 102, 204);
            doc.textWithLink('Link', data.cell.x + 2, data.cell.y + data.cell.height / 2 + 1, { url: anexo });
            doc.setTextColor(0, 0, 0);
          }
        }
      }
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.line(14, 195, 283, 195);
      doc.text('Copyright © 2026 | Zaqueu Fernandes | Suporte: 88 9 9401-4262', 148, 202, { align: 'center' });
    }

    doc.save(`relatorio-rh-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      <FiltrosRH filtros={filtrosRH} setFiltros={setFiltrosRH} fazerLogout={fazerLogout} />
      <CardsRH totais={totais} />

      {loading && (
        <div className="text-center py-16 text-gray-700">
          <i className="fas fa-spinner fa-spin text-5xl text-green-800 mb-4"></i>
          <p className="text-lg">Buscando dados na base...</p>
        </div>
      )}

      {!loading && semDados && (
        <div className="text-center py-16 text-gray-700">
          <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
          <p className="text-lg">Nenhum dado encontrado na base</p>
        </div>
      )}

      {!loading && !semDados && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h3 className="text-green-800 text-lg md:text-xl font-bold flex items-center gap-2">
              <i className="fas fa-table"></i> Registros ({dados.length})
            </h3>
            <button onClick={exportarPDF} className="px-4 md:px-5 py-2 md:py-2.5 bg-green-800 text-white rounded-md font-bold transition-colors hover:bg-green-700 flex items-center gap-2 text-sm md:text-base">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
          <TabelaRH dados={dados} />
        </>
      )}
    </div>
  );
};

export default RecursosHumanos;
