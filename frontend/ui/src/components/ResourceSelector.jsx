// Importa hooks do React, API para requisições e estilos CSS do seletor
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './ResourceSelector.css';

// Componente que permite alocar recursos (pistas, veículos, etc.) para um voo
export default function ResourceSelector({ flightId, type, onAllocated }) {
  const [resources, setResources] = useState([]);              // Lista de recursos disponíveis
  const [selectedType, setSelectedType] = useState(type || 'runway'); // Tipo selecionado, se não for fixo via prop

  // Determina o tipo de recurso efetivamente usado (fixo ou selecionado pelo usuário)
  const effectiveType = type || selectedType;

  // Carrega os recursos disponíveis do tipo escolhido sempre que o tipo ou voo mudar
  useEffect(() => {
    if (!effectiveType || !flightId) return;

    api.get(`/resources?type=${effectiveType}&free=true`)
      .then(res => setResources(res.data))
      .catch(err => console.error('Erro ao buscar recursos:', err));
  }, [effectiveType, flightId]);

  // Função para alocar um recurso ao voo
  const handleAllocate = async (resourceId) => {
    try {
      await api.post('/resources/allocate', {
        flightId,
        resourceId
      });
      if (onAllocated) onAllocated(); // Notifica componente pai, se necessário
    } catch (err) {
      console.error('Erro ao alocar recurso:', err);
      alert('Não foi possível alocar o recurso. Verifique se ainda está disponível.');
    }
  };

  // Rótulos em português para os tipos de recurso
  const resourceLabels = {
    gate: 'Portões disponíveis',
    runway: 'Pistas disponíveis',
    vehicle: 'Veículos disponíveis',
    hangar: 'Hangars disponíveis',
    service: 'Serviços gerais'
  };

  // Renderização do seletor de tipo e da lista de recursos com botão de alocar
  return (
    <div className="resource-selector">
      {/* Se não for passado um tipo fixo via prop, exibe o dropdown para o usuário escolher */}
      {!type && (
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
        >
          <option value="gate">Portões</option>
          <option value="runway">Pistas</option>
          <option value="vehicle">Veículos</option>
          <option value="hangar">Hangars</option>
          <option value="service">Serviços</option>
        </select>
      )}

      {/* Título da seção com base no tipo */}
      <h4>{resourceLabels[effectiveType] || 'Recursos disponíveis'}</h4>

      {/* Lista de recursos disponíveis ou mensagem de vazio */}
      <ul>
        {resources.length === 0 && <li>Sem recursos disponíveis.</li>}
        {resources.map(resource => (
          <li key={resource.id}>
            {resource.code}
            <button onClick={() => handleAllocate(resource.id)}>Alocar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
