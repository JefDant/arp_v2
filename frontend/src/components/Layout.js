import React from 'react';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <h1>ARP - Sistema de Gestão</h1>
        <nav>
          <ul>
            <li><a href="#entidades">Entidades</a></li>
            <li><a href="#usuarios">Usuários</a></li>
            <li><a href="#atas">Atas</a></li>
            <li><a href="#aditivos">Aditivos</a></li>
            <li><a href="#empenhos">Empenhos</a></li>
            <li><a href="#pagamentos">Pagamentos</a></li>
          </ul>
        </nav>
        <button onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }}>Sair</button>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}

export default Layout; 