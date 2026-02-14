import { Totais } from '../services/supabase';

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
};

interface CardsProps {
  totais: Totais;
}

const Cards = ({ totais }: CardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl">
          <i className="fas fa-arrow-up"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase">RECEITAS</span>
          <span className="text-2xl font-bold text-gray-700">{formatarMoeda(totais.receitas)}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-2xl">
          <i className="fas fa-arrow-down"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase">DESPESA BRUTA</span>
          <span className="text-2xl font-bold text-gray-700">{formatarMoeda(totais.despesaBruta)}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl">
          <i className="fas fa-minus"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase">DEDUÇÕES</span>
          <span className="text-2xl font-bold text-gray-700">{formatarMoeda(totais.deducoes)}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl">
          <i className="fas fa-calculator"></i>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase">DESPESA LÍQUIDA</span>
          <span className="text-2xl font-bold text-gray-700">{formatarMoeda(totais.despesaLiquida)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cards;
