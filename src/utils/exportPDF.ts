import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (dados: any[], tituloRelatorio = "Relatório Financeiro") => {
  const doc = new jsPDF();
  
  doc.setFillColor(21, 128, 61);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Câmara Municipal de Araripe", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text(tituloRelatorio, 105, 30, { align: "center" });

  const body = dados.map(item => [
    item.data,
    item.credor,
    item.categoria,
    `R$ ${Number(item.despesa_liquida).toLocaleString('pt-BR')}`
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Data', 'Credor', 'Categoria', 'Vlr Líquido']],
    body: body,
    headStyles: { fillColor: [21, 128, 61] },
    theme: 'grid'
  });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Gerado por Painel do Gestor em ${new Date().toLocaleString()}`, 10, doc.internal.pageSize.height - 10);

  doc.save(`CMA_Relatorio_${Date.now()}.pdf`);
};
