import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts';

const COLORS = ['#48bb78', '#4299e1', '#f59e0b', '#f56565', '#9f7aea', '#38b2ac', '#ed8936', '#fc8181', '#63b3ed', '#68d391'];

const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor || 0);
};

interface GraficosProps {
  dadosGraficos: {
    despesasPorCategoria: Record<string, number>;
    evolucaoMensal: Record<string, { receitas: number; despesas: number }>;
    top10Credores: [string, number][];
    totais: any;
  };
}

const Graficos = ({ dadosGraficos }: GraficosProps) => {
  // Pizza - Categorias
  const dataPie = Object.entries(dadosGraficos.despesasPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  // Evolução Mensal
  const mesesOrdenados = Object.keys(dadosGraficos.evolucaoMensal).sort((a, b) => {
    const [mesA, anoA] = a.split('/');
    const [mesB, anoB] = b.split('/');
    return new Date(Number(anoA), Number(mesA) - 1).getTime() - new Date(Number(anoB), Number(mesB) - 1).getTime();
  });

  const dataEvolucao = mesesOrdenados.map(mes => ({
    name: mes,
    Receitas: dadosGraficos.evolucaoMensal[mes].receitas,
    Despesas: dadosGraficos.evolucaoMensal[mes].despesas
  }));

  // Top 10 Credores
  const dataCredores = dadosGraficos.top10Credores.map(([name, value]) => ({
    name,
    Despesas: value
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Pizza - Despesas por Categoria */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h4 className="text-gray-700 mb-4 font-semibold">Despesas por Categoria</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dataPie} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {dataPie.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Colunas - Receitas vs Despesas */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h4 className="text-gray-700 mb-4 font-semibold">Receitas vs Despesas</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataEvolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              <Legend />
              <Bar dataKey="Receitas" fill="#48bb78" />
              <Bar dataKey="Despesas" fill="#f56565" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Linha - Evolução Mensal */}
      <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
        <h4 className="text-gray-700 mb-4 font-semibold">Evolução Mensal</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataEvolucao}>
              <CartesianGrid stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              <Legend />
              <Line type="monotone" dataKey="Receitas" stroke="#48bb78" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Despesas" stroke="#f56565" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barras Horizontais - Top 10 Credores */}
      <div className="bg-white p-6 rounded-xl shadow md:col-span-2">
        <h4 className="text-gray-700 mb-4 font-semibold">Top 10 Credores</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataCredores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              <Bar dataKey="Despesas" fill="#4299e1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
