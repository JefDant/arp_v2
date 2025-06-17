import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://31.97.18.235:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setLogado(true);
        setErro('');
      } else {
        setErro(data.mensagem || 'Erro ao fazer login');
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor');
    }
  };

  if (logado) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>ARP - Sistema de Gestão</h1>
          <p>Bem-vindo ao sistema!</p>
          <button onClick={() => {
            localStorage.removeItem('token');
            setLogado(false);
          }}>Sair</button>
        </header>
      </div>
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