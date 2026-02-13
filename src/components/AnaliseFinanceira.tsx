import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line 
} from 'recharts';

const AnaliseFinanceira = () => {
  const [dados, setDados] = useState<any[]>([]);
  const COLORS = ['#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from('base').select('*');
      if (data) setDados(data);
    };
    getData();
  }, []);

  const dataPie = Object.values(dados.reduce((acc: any, curr) => {
    const cat = curr.categoria || 'Outros';
    if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
    acc[cat].value += Number(curr.despesa_liquida) || 0;
    return acc;
  }, {}));

  const dataCompare = [{
    name: 'Total Geral',
    Receitas: dados.reduce((a, b) => a + (Number(b.receitas) || 0), 0),
    Despesas: dados.reduce((a, b) => a + (Number(b.despesa_bruta) || 0), 0)
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h3 className="text-green-800 font-bold mb-4 flex items-center">
          <i className="fa-solid fa-chart-pie mr-2"></i> Distribuição por Categoria
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataPie} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {dataPie.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h3 className="text-green-800 font-bold mb-4">
          <i className="fa-solid fa-chart-bar mr-2"></i> Receitas vs Despesas
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCompare}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Legend />
              <Bar dataKey="Receitas" fill="#15803d" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 md:col-span-2">
        <h3 className="text-green-800 font-bold mb-4">
          <i className="fa-solid fa-chart-line mr-2"></i> Evolução Mensal (Despesa Líquida)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dados}>
              <CartesianGrid stroke="#f3f4f6" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
              <Line type="monotone" dataKey="despesa_liquida" stroke="#15803d" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnaliseFinanceira;
