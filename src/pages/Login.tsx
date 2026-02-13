import React, { useState } from 'react';
import { supabase } from '../api/supabase';

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
  onGoToSignup: () => void;
}

const Login = ({ onLoginSuccess, onGoToSignup }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      alert("⚠️ Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar usuário:", error);
        alert("Erro ao conectar com a base de usuários.");
        return;
      }

      if (data) {
        if (data.status === 'APROVADO') {
          onLoginSuccess({ ...data, userStatus: 'APROVADO' });
        } else {
          alert("⏳ Cadastro pendente de aprovação. Entre em contato com o suporte.");
        }
      } else {
        alert("❌ E-mail ou Senha Incorretos. Caso esqueceu, entre em contato com o suporte.");
      }
    } catch (error) {
      alert("Erro ao conectar com a base de usuários.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-green-700 w-full max-w-md">
        <div className="text-center mb-6">
          <i className="fa-solid fa-lock text-4xl text-green-700 mb-2"></i>
          <h3 className="text-2xl font-bold text-gray-800">Acesso ao Painel</h3>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="E-mail" className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha" className="w-full p-3 border rounded focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setSenha(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full bg-green-700 text-white p-3 rounded font-bold hover:bg-green-800 flex justify-center items-center">
            {loading ? (<><i className="fa-solid fa-arrows-rotate fa-spin mr-2"></i> Logando...</>) : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <button onClick={onGoToSignup} className="text-green-700 font-bold hover:underline">Não tem conta? Cadastre-se aqui</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
