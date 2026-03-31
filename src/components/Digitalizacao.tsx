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

const PaginaEmDesenvolvimento = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      <div className="text-green-800 mb-6">
        <i className="fas fa-cog fa-spin text-7xl"></i>
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
      >
        <i className="fab fa-whatsapp text-xl"></i> Falar no WhatsApp
      </button>
    </div>
  );
};

const Digitalizacao = ({ fazerLogout, filtros, setFiltros }: DigitalizacaoProps) => {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'2021-2024' | '2025+'>('2021-2024');
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
    if (periodoSelecionado === '2021-2024') {
      carregarDados();
    }
  }, [filtros, periodoSelecionado]);

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

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
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
      item.processo ? 'Link' : '-'
    ]);

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
        if (data.section === 'body' && data.column.index === 9 && data.cell.raw === 'Link') {
          const processo = dados[data.row.index]?.processo;
          if (processo) {
            doc.setTextColor(0, 102, 204);
            doc.textWithLink('Link', data.cell.x + 2, data.cell.y + data.cell.height / 2 + 1, { url: processo });
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

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Seletor de Período */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setPeriodoSelecionado('2021-2024')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
              periodoSelecionado === '2021-2024'
                ? 'bg-green-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-calendar-alt"></i> Período: 2021 a 2024
          </button>
          <button
            onClick={() => setPeriodoSelecionado('2025+')}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm md:text-base transition-all flex items-center justify-center gap-2 ${
              periodoSelecionado === '2025+'
                ? 'bg-green-800 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <i className="fas fa-calendar-plus"></i> Período: 2025 em diante
          </button>
        </div>
      </div>

      {periodoSelecionado === '2025+' ? (
        <PaginaEmDesenvolvimento />
      ) : (
        <>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-green-800 text-lg md:text-xl font-bold flex items-center gap-2">
                  <i className="fas fa-table"></i> Registros ({dados.length})
                </h3>
                <button onClick={exportarPDF} className="px-4 md:px-5 py-2 md:py-2.5 bg-green-800 text-white rounded-md font-bold transition-colors hover:bg-green-700 flex items-center gap-2 text-sm md:text-base">
                  <i className="fas fa-file-pdf"></i> Exportar PDF
                </button>
              </div>
              <Tabela dados={dados} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Digitalizacao;
