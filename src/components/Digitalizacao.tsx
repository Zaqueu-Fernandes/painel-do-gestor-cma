import { useState, useEffect } from 'react';
import { buscarDadosBase, Filtros as FiltrosType, Totais } from '../services/supabase';
import Filtros from './Filtros';
import Cards from './Cards';
import Tabela from './Tabela';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DigitalizacaoProps {
  fazerLogout: () => void;
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
}

const Digitalizacao = ({ fazerLogout, filtros, setFiltros }: DigitalizacaoProps) => {
  const [dados, setDados] = useState<any[]>([]);
  const [totais, setTotais] = useState<Totais>({
    receitas: 0,
    despesaBruta: 0,
    deducoes: 0,
    despesaLiquida: 0
  });
  const [loading, setLoading] = useState(true);
  const [semDados, setSemDados] = useState(false);

  useEffect(() => {
    carregarDados();
  }, [filtros]);

  const carregarDados = async () => {
    setLoading(true);
    setSemDados(false);

    try {
      const resultado = await buscarDadosBase(filtros);

      if (resultado.sucesso) {
        setDados(resultado.dados);
        setTotais(resultado.totais);

        if (resultado.dados.length === 0) {
          setSemDados(true);
        }
      } else {
        setSemDados(true);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Câmara Municipal de Araripe', 148, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Digitalização', 148, 23, { align: 'center' });

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
      // Exibir filtros em linha, separados por " | "
      const linhaFiltros = filtrosTexto.join('  |  ');
      doc.text(linhaFiltros, 14, y);
      y += 8;
      doc.setLineWidth(0.2);
      doc.line(14, y, 283, y);
      y += 4;
    } else {
      y = 34;
    }

    const dadosTabela = dados.map((item) => [
      new Date(item.data).toLocaleDateString('pt-BR'),
      item.doc_caixa || '-',
      item.natureza || '-',
      item.categoria || '-',
      item.credor || '-',
      formatarMoeda(item.receitas),
      formatarMoeda(item.despesa_bruta),
      formatarMoeda(item.deducoes),
      formatarMoeda(item.despesa_liquida),
      item.processo ? '👁' : '-'
    ]);

    // Subtotais
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Subtotais:', 14, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const subtotaisTexto = `Receitas: ${formatarMoeda(totais.receitas)}  |  Desp. Bruta: ${formatarMoeda(totais.despesaBruta)}  |  Deduções: ${formatarMoeda(totais.deducoes)}  |  Desp. Líquida: ${formatarMoeda(totais.despesaLiquida)}`;
    doc.text(subtotaisTexto, 14, y);
    y += 8;
    doc.setLineWidth(0.2);
    doc.line(14, y, 283, y);
    y += 4;

    autoTable(doc, {
      head: [['Data', 'Doc', 'Natureza', 'Categoria', 'Credor', 'Receitas', 'Desp. Bruta', 'Deduções', 'Desp. Líquida', 'Processo']],
      body: dadosTabela,
      startY: y,
      theme: 'grid',
      headStyles: { fillColor: [45, 80, 22] },
      styles: { fontSize: 8 },
      didDrawCell: (data: any) => {
        if (data.section === 'body' && data.column.index === 9 && data.cell.raw === '👁') {
          const processo = dados[data.row.index]?.processo;
          if (processo) {
            doc.setTextColor(0, 102, 204);
            doc.textWithLink('👁', data.cell.x + 4, data.cell.y + data.cell.height / 2 + 1, { url: processo });
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
      doc.text(
        'Copyright © 2026 | Zaqueu Fernandes | Suporte: 88 9 9401-4262',
        148,
        202,
        { align: 'center' }
      );
    }

    doc.save(`relatorio-digitalizacao-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <Filtros
        filtros={filtros}
        setFiltros={setFiltros}
        fazerLogout={fazerLogout}
      />

      <Cards totais={totais} />

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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-green-800 text-xl font-bold flex items-center gap-2">
              <i className="fas fa-table"></i> Registros ({dados.length})
            </h3>
            <button onClick={exportarPDF} className="px-5 py-2.5 bg-green-800 text-white rounded-md font-bold transition-colors hover:bg-green-700 flex items-center gap-2">
              <i className="fas fa-file-pdf"></i> Exportar PDF
            </button>
          </div>
          <Tabela dados={dados} />
        </>
      )}
    </div>
  );
};

export default Digitalizacao;
