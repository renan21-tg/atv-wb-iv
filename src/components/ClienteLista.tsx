import React, { useState, useEffect } from 'react';
import { apiClientes } from '../services/api';
import { Cliente } from '../models/cliente';

interface ClienteListaProps {
  onEditarCliente: (id: number) => void;
  onAtualizarLista: () => void;
}

const ClienteLista: React.FC<ClienteListaProps> = ({ onEditarCliente, onAtualizarLista }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      setErro(null);
      const dados = await apiClientes.listar();
      setClientes(dados);
      setSucesso('Lista de clientes atualizada com sucesso');
      setTimeout(() => setSucesso(null), 3000);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setErro(error.message || 'Erro ao carregar lista de clientes');
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      setCarregando(true);
      await apiClientes.excluir(id);
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
      setSucesso('Cliente excluído com sucesso');
      setTimeout(() => setSucesso(null), 3000);
      onAtualizarLista();
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      setErro(error.message || 'Erro ao excluir cliente');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="cliente-lista-container">
      <h2 className="lista-titulo">Lista de Clientes</h2>
      
      {/* Mensagens de feedback */}
      {erro && (
        <div className="alert alert-danger">
          {erro}
          <button onClick={() => setErro(null)} className="close-btn">×</button>
        </div>
      )}
      
      {sucesso && (
        <div className="alert alert-success">
          {sucesso}
          <button onClick={() => setSucesso(null)} className="close-btn">×</button>
        </div>
      )}

      {/* Botão de recarregar */}
      <div className="lista-acoes">
        <button 
          onClick={carregarClientes} 
          disabled={carregando}
          className="btn-recarregar"
        >
          {carregando ? 'Atualizando...' : 'Atualizar Lista'}
        </button>
      </div>

      {/* Tabela de clientes */}
      {carregando && clientes.length === 0 ? (
        <div className="loading-indicator">Carregando clientes...</div>
      ) : clientes.length === 0 ? (
        <div className="empty-message">Nenhum cliente cadastrado</div>
      ) : (
        <div className="table-responsive">
          <table className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nome}</td>
                  <td>{cliente.sobreNome}</td>
                  <td>{cliente.endereco?.cidade || '-'}</td>
                  <td>{cliente.endereco?.estado || '-'}</td>
                  <td className="acoes-cell">
                    <button
                      onClick={() => cliente.id && onEditarCliente(cliente.id)}
                      className="btn-editar"
                      disabled={carregando}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => cliente.id && handleExcluir(cliente.id)}
                      className="btn-excluir"
                      disabled={carregando}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClienteLista;