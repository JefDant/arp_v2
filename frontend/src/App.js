import React, { useState } from 'react';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Tentando fazer login com:', { email, senha });
    try {
      const response = await fetch('http://31.97.18.235:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      console.log('Resposta do servidor:', response.status);
      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setLogado(true);
        setErro('');
      } else {
        setErro(data.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Erro ao conectar com o servidor');
    }
  };

  if (logado) {
    return (
      <Layout>
        <div className="dashboard">
          <h2>Dashboard</h2>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Atas</h3>
              <p>Total: 0</p>
            </div>
            <div className="dashboard-card">
              <h3>Aditivos</h3>
              <p>Total: 0</p>
            </div>
            <div className="dashboard-card">
              <h3>Empenhos</h3>
              <p>Total: 0</p>
            </div>
            <div className="dashboard-card">
              <h3>Pagamentos</h3>
              <p>Total: 0</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>ARP - Sistema de Gestão</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {erro && <p className="erro">{erro}</p>}
          <button type="submit">Entrar</button>
        </form>
      </header>
    </div>
  );
}

export default App; 