import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://stsqjnincxsjqkrfpvod.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0c3FqbmluY3hzanFrcmZwdm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODg1OTMsImV4cCI6MjA4NjE2NDU5M30.vQr9CGpUy3N8PidOiNNrBtBeY5i-B7PZy1V7KtrApss';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ========================================
// CADASTRAR USUÁRIO
// ========================================
export async function cadastrarUsuario(dados: {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  senha: string;
}) {
  try {
    const { data: existente } = await supabase
      .from('usuarios')
      .select('email')
      .eq('email', dados.email.trim().toLowerCase())
      .single();

    if (existente) {
      return { sucesso: false, mensagem: 'EMAIL_EXISTE' };
    }

    const { error } = await supabase
      .from('usuarios')
      .insert([{
        nome: dados.nome,
        email: dados.email.trim().toLowerCase(),
        telefone: dados.telefone,
        cargo: dados.cargo,
        senha: dados.senha,
        status: 'PENDENTE'
      }]);

    if (error) throw error;

    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
  } catch (erro: any) {
    console.error('Erro ao cadastrar usuário:', erro);
    return { sucesso: false, mensagem: erro.message || 'Erro ao cadastrar usuário' };
  }
}

// ========================================
// VALIDAR TELEFONE
// ========================================
export function validarTelefone(telefone: string) {
  const numeros = telefone.replace(/\D/g, '');
  const regex = /^[1-9]{2}9\d{8}$/;
  return regex.test(numeros);
}

// ========================================
// FORMATAR TELEFONE
// ========================================
export function formatarTelefone(valor: string) {
  const numeros = valor.replace(/\D/g, '');

  if (numeros.length === 0) return '';
  if (numeros.length <= 2) return `(${numeros}`;
  if (numeros.length <= 3) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)}${numeros.slice(3)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 3)}${numeros.slice(3, 7)}-${numeros.slice(7, 11)}`;
}

// ========================================
// TIPOS DE FILTRO
// ========================================
export interface Filtros {
  dataInicial: string;
  dataFinal: string;
  mes: string;
  ano: string;
  natureza: string;
  categoria: string;
  credor: string;
  docCaixa: string;
  descricao: string;
}

export interface Totais {
  receitas: number;
  despesaBruta: number;
  deducoes: number;
  despesaLiquida: number;
}

// ========================================
// BUSCAR DADOS DA TABELA BASE
// ========================================
export async function buscarDadosBase(filtros: Filtros = {} as Filtros) {
  try {
    let query = supabase
      .from('base')
      .select('data, doc_caixa, natureza, categoria, credor, descricao, receitas, despesa_bruta, deducoes, despesa_liquida, processo')
      .order('data', { ascending: true });

    if (filtros.dataInicial && filtros.dataFinal) {
      query = query
        .gte('data', filtros.dataInicial)
        .lte('data', filtros.dataFinal);
    } else if (filtros.mes && filtros.ano) {
      const mesNum = String(filtros.mes).padStart(2, '0');
      const anoNum = String(filtros.ano);
      const dataInicio = `${anoNum}-${mesNum}-01`;

      let proximoMes = parseInt(filtros.mes) + 1;
      let proximoAno = parseInt(filtros.ano);

      if (proximoMes > 12) {
        proximoMes = 1;
        proximoAno += 1;
      }

      const dataFim = `${proximoAno}-${String(proximoMes).padStart(2, '0')}-01`;

      query = query
        .gte('data', dataInicio)
        .lt('data', dataFim);
    } else if (filtros.ano && !filtros.mes) {
      const dataInicio = `${filtros.ano}-01-01`;
      const dataFim = `${parseInt(filtros.ano) + 1}-01-01`;
      query = query
        .gte('data', dataInicio)
        .lt('data', dataFim);
    }

    if (filtros.natureza && filtros.natureza !== 'TODOS') {
      query = query.eq('natureza', filtros.natureza);
    }
    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria);
    }
    if (filtros.credor) {
      query = query.eq('credor', filtros.credor);
    }
    if (filtros.docCaixa) {
      query = query.ilike('doc_caixa', `%${filtros.docCaixa}%`);
    }
    if (filtros.descricao) {
      query = query.ilike('descricao', `%${filtros.descricao}%`);
    }

    // Buscar TODAS as linhas com paginação automática
    let allData: any[] = [];
    let from = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await query.range(from, from + pageSize - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allData = allData.concat(data);
        from += pageSize;
        if (data.length < pageSize) hasMore = false;
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Total de registros carregados: ${allData.length}`);

    const totais: Totais = { receitas: 0, despesaBruta: 0, deducoes: 0, despesaLiquida: 0 };

    allData.forEach(item => {
      totais.receitas += parseFloat(item.receitas || 0);
      totais.despesaBruta += parseFloat(item.despesa_bruta || 0);
      totais.deducoes += parseFloat(item.deducoes || 0);
      totais.despesaLiquida += parseFloat(item.despesa_liquida || 0);
    });

    return { sucesso: true, dados: allData, totais };
  } catch (erro: any) {
    console.error('Erro ao buscar dados:', erro);
    return { sucesso: false, mensagem: erro.message, dados: [], totais: { receitas: 0, despesaBruta: 0, deducoes: 0, despesaLiquida: 0 } };
  }
}

// ========================================
// BUSCAR ANOS DISPONÍVEIS NA BASE
// ========================================
export async function buscarAnosDisponiveis() {
  try {
    const { data, error } = await supabase
      .from('base')
      .select('data');

    if (error) throw error;

    const anos = [...new Set(
      (data || []).map(item => new Date(item.data).getFullYear()).filter(a => !isNaN(a))
    )].sort((a, b) => b - a);

    return anos;
  } catch (erro) {
    console.error('Erro ao buscar anos:', erro);
    return [];
  }
}

// ========================================
// BUSCAR CATEGORIAS E CREDORES ÚNICOS
// ========================================
export async function buscarFiltrosDisponiveis() {
  try {
    const { data, error } = await supabase
      .from('base')
      .select('categoria, credor');

    if (error) throw error;

    const categorias = [...new Set((data || []).map(item => item.categoria).filter(Boolean))].sort();
    const credores = [...new Set((data || []).map(item => item.credor).filter(Boolean))].sort();

    return { categorias, credores };
  } catch (erro) {
    console.error('Erro ao buscar filtros:', erro);
    return { categorias: [], credores: [] };
  }
}

// ========================================
// DADOS PARA GRÁFICOS
// ========================================
export async function buscarDadosGraficos(filtros: Filtros = {} as Filtros) {
  try {
    const resultado = await buscarDadosBase(filtros);

    if (!resultado.sucesso || resultado.dados.length === 0) {
      return { sucesso: false };
    }

    const dados = resultado.dados;

    const despesasPorCategoria: Record<string, number> = {};
    dados.forEach(item => {
      if (item.natureza === 'DESPESA') {
        if (!despesasPorCategoria[item.categoria]) despesasPorCategoria[item.categoria] = 0;
        despesasPorCategoria[item.categoria] += parseFloat(item.despesa_liquida || 0);
      }
    });

    const evolucaoMensal: Record<string, { receitas: number; despesas: number }> = {};
    dados.forEach(item => {
      const data = new Date(item.data);
      const mesAno = `${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
      if (!evolucaoMensal[mesAno]) evolucaoMensal[mesAno] = { receitas: 0, despesas: 0 };
      if (item.natureza === 'RECEITA') {
        evolucaoMensal[mesAno].receitas += parseFloat(item.receitas || 0);
      } else {
        evolucaoMensal[mesAno].despesas += parseFloat(item.despesa_liquida || 0);
      }
    });

    const despesasPorCredor: Record<string, number> = {};
    dados.forEach(item => {
      if (item.natureza === 'DESPESA') {
        if (!despesasPorCredor[item.credor]) despesasPorCredor[item.credor] = 0;
        despesasPorCredor[item.credor] += parseFloat(item.despesa_liquida || 0);
      }
    });

    const top10Credores = Object.entries(despesasPorCredor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      sucesso: true,
      despesasPorCategoria,
      evolucaoMensal,
      top10Credores,
      totais: resultado.totais
    };
  } catch (erro) {
    console.error('Erro ao buscar dados para gráficos:', erro);
    return { sucesso: false };
  }
}
