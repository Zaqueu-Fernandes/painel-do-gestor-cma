import React, { useState } from 'react';
import { supabase } from '../api/supabase';

interface CadastroProps {
  onGoToLogin: () => void;
  onSuccess: () => void;
}

const Cadastro = ({ onGoToLogin, onSuccess }: CadastroProps) => {
  const [formData, setFormData] = useState({ 
    nome: '', email: '', telefone: '', cargo: '', senha: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleTelefone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    setFormData({ ...formData, telefone: v });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(formData).some(x => x === '')) {
      alert("⚠️ Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const { data: existing, error: selectError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (selectError) {
        console.error("Erro ao verificar e-mail:", selectError);
        alert("❌ Erro ao realizar cadastro. Tente novamente.");
        return;
      }

      if (existing) {
        alert("📧 Este e-mail já está cadastrado.");
        return;
      }

      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([{
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cargo: formData.cargo,
          senha: formData.senha,
          status: 'PENDENTE'
        }]);

      if (insertError) {
        console.error("Erro ao inserir usuário:", insertError);
        alert("❌ Erro ao realizar cadastro. Tente novamente.");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert("❌ Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-green-100 animate-fadeIn">
      <h3 className="text-2xl font-bold text-center text-green-800 mb-6">
        <i className="fa-solid fa-user-plus mr-2"></i>Solicitar Cadastro
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Nome Completo</label>
          <input type="text" placeholder="Ex: João Silva" className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={e => setFormData({...formData, nome: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-mail Institucional</label>
          <input type="email" placeholder="email@exemplo.com" className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Telefone / WhatsApp</label>
          <input type="text" value={formData.telefone} placeholder="(88) 9XXXX-XXXX" className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={handleTelefone} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Cargo / Função</label>
          <input type="text" placeholder="Ex: Assessor Legislativo" className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={e => setFormData({...formData, cargo: e.target.value})} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Defina uma Senha</label>
          <input type="password" placeholder="••••••••" className="w-full p-3 border rounded border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition-all" onChange={e => setFormData({...formData, senha: e.target.value})} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-700 text-white p-3 rounded-lg font-bold hover:bg-green-800 transition-all flex justify-center items-center shadow-md active:scale-95 disabled:opacity-70">
          {loading ? (<><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Enviando Solicitação...</>) : ('Solicitar Acesso')}
        </button>
      </form>

      <div className="mt-6 text-center border-t pt-4">
        <p className="text-sm text-gray-600">
          Já possui uma conta? 
          <button onClick={onGoToLogin} className="ml-1 text-green-700 font-bold hover:underline">Voltar ao Login</button>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
