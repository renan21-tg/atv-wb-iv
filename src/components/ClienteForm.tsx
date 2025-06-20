import React, { useState, useEffect } from 'react';
import { buscarCliente, cadastrarCliente, atualizarCliente } from '../services/api';
import { Cliente, Endereco } from '../models/cliente';

interface ClienteFormProps {
  clienteId?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ clienteId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Cliente>({
    nome: '',
    sobreNome: '',
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      codigoPostal: '',
      informacoesAdicionais: ''
    }
  });
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (clienteId) {
      const carregarCliente = async () => {
        try {
          setCarregando(true);
          setErro(null);
          const response = await buscarCliente(clienteId);
          setFormData(response.data);
        } catch (erro) {
          console.error('Erro ao carregar cliente:', erro);
          setErro('Erro ao carregar dados do cliente.');
        } finally {
          setCarregando(false);
        }
      };
      carregarCliente();
    }
  }, [clienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCarregando(true);
      setErro(null);
      
      if (clienteId) {
        await atualizarCliente(clienteId, formData);
      } else {
        await cadastrarCliente(formData);
      }
      
      onSuccess();
    } catch (erro) {
      console.error('Erro ao salvar cliente:', erro);
      setErro('Erro ao salvar cliente. Verifique os dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{clienteId ? 'Editar Cliente' : 'Novo Cliente'}</h2>
      
      {erro && <div className="error">{erro}</div>}
      
      <div className="form-row">
        <div className="form-column">
          <label>Nome*</label>
          <input 
            type="text" 
            name="nome" 
            value={formData.nome} 
            onChange={handleChange} 
            required 
            disabled={carregando}
          />
        </div>
        
        <div className="form-column">
          <label>Sobrenome*</label>
          <input 
            type="text" 
            name="sobreNome" 
            value={formData.sobreNome} 
            onChange={handleChange} 
            required 
            disabled={carregando}
          />
        </div>
      </div>
      
      <h3>Endereço</h3>
      
      <div className="form-row">
        <div className="form-column">
          <label>Estado*</label>
          <input 
            type="text" 
            name="estado" 
            value={formData.endereco.estado} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
        
        <div className="form-column">
          <label>Cidade*</label>
          <input 
            type="text" 
            name="cidade" 
            value={formData.endereco.cidade} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-column">
          <label>Bairro*</label>
          <input 
            type="text" 
            name="bairro" 
            value={formData.endereco.bairro} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
        
        <div className="form-column">
          <label>Rua*</label>
          <input 
            type="text" 
            name="rua" 
            value={formData.endereco.rua} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-column">
          <label>Número*</label>
          <input 
            type="text" 
            name="numero" 
            value={formData.endereco.numero} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
        
        <div className="form-column">
          <label>CEP*</label>
          <input 
            type="text" 
            name="codigoPostal" 
            value={formData.endereco.codigoPostal} 
            onChange={handleEnderecoChange} 
            required 
            disabled={carregando}
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-column">
          <label>Informações Adicionais</label>
          <input 
            type="text" 
            name="informacoesAddicionais" 
            value={formData.endereco.informacoesAdicionais} 
            onChange={handleEnderecoChange} 
            disabled={carregando}
          />
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          type="button" 
          className="secondary" 
          onClick={onCancel}
          disabled={carregando}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={carregando}
        >
          {carregando ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
};

export default ClienteForm;