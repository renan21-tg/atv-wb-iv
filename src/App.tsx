import React, { useState } from 'react';
import ClienteLista from './components/ClienteLista';
import ClienteForm from './components/ClienteForm';
import './App.css';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [clienteEditandoId, setClienteEditandoId] = useState<number | null>(null);
  const [listaAtualizada, setListaAtualizada] = useState<number>(0); 
  const handleNovoCliente = () => {
    setClienteEditandoId(null);
    setView('form');
  };

  const handleEditarCliente = (id: number) => {
    setClienteEditandoId(id);
    setView('form');
  };

  const handleVoltar = () => {
    setView('list');
    setClienteEditandoId(null);
    setListaAtualizada(prev => prev + 1); 
  };

  const handleAtualizarLista = () => {
    setListaAtualizada(prev => prev + 1);
  };

  return (
    <div className="App">
      <header>
        <h1>Sistema de Gerenciamento de Clientes</h1>
      </header>

      {view === 'form' ? (
        <div>
          <ClienteForm 
            clienteId={clienteEditandoId || undefined} 
            onSuccess={handleVoltar}
            onCancel={handleVoltar}
          />
        </div>
      ) : (
        <div>
          <div className="header-actions">
            <button onClick={handleNovoCliente}>+ Novo Cliente</button>
          </div>
          <ClienteLista 
            onEditarCliente={handleEditarCliente}
            onAtualizarLista={handleAtualizarLista}
            key={listaAtualizada} 
          />
        </div>
      )}
    </div>
  );
};

export default App;