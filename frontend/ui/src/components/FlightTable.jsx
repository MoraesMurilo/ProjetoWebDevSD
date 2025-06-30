// Importa hooks do React, API para requisições e conexão via WebSocket
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import socket from '../services/socket';
import './FlightTable.css';

// Componente que exibe a tabela de voos com filtro, status e recursos
export default function FlightTable({ selectedFlight, onSelectFlight }) {
  const [flights, setFlights] = useState([]); // Lista de voos
  const [filter, setFilter] = useState('');   // Filtro de busca no topo da tabela

  // Rótulos traduzidos para os status dos voos
  const statusLabels = {
    scheduled: 'Agendado',
    landed: 'Pousado',
    'boarding complete': 'Embarque concluído',
    departed: 'Partido'
  };

  // Busca a lista de voos do backend
  const fetchFlights = () => {
    api.get('/flights')
      .then(res => setFlights(res.data))
      .catch(err => console.error('Erro ao buscar voos:', err));
  };

  // Carrega os voos ao montar o componente
  useEffect(() => {
    fetchFlights();
  }, []);

  // Atualiza um voo na lista ao receber evento via WebSocket
  useEffect(() => {
    const handleUpdate = updated => {
      setFlights(prev =>
        prev.map(f => (f.id === updated.id ? updated : f))
      );
    };
    socket.on('flightUpdated', handleUpdate);
    return () => socket.off('flightUpdated', handleUpdate);
  }, []);

  // Atualiza a lista de voos quando um recurso é liberado
  useEffect(() => {
    const handleFree = () => fetchFlights();
    socket.on('resourceFreed', handleFree);
    return () => socket.off('resourceFreed', handleFree);
  }, []);

  // Altera o status de um voo via requisição PATCH
  const handleStatusChange = async (flightId, newStatus) => {
    try {
      await api.patch(`/flights/${flightId}`, { status: newStatus });
    } catch (err) {
      console.error('Erro ao atualizar status do voo:', err);
    }
  };

  // Filtra os voos com base no texto digitado (número, origem, destino ou recursos)
  const filteredFlights = flights.filter(f =>
    [f.number, f.origin, f.destination, ...(f.resources || [])]
      .some(field =>
        field && field.toLowerCase().includes(filter.toLowerCase())
      )
  );

  // Renderiza a tabela de voos com campos filtráveis, seleção e edição de status
  return (
    <div className="flight-table-container">
      <input
        type="text"
        className="flight-filter"
        placeholder="Buscar voo, origem, destino ou recurso..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <div className="table-wrapper">
        <table className="flight-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Horário</th>
              <th>Recursos</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map(f => (
              <tr
                key={f.id}
                onClick={() => onSelectFlight(f.id)}
                className={f.id === selectedFlight ? 'selected' : ''}
              >
                <td>{f.number}</td>
                <td>{f.origin}</td>
                <td>{f.destination}</td>
                <td>{new Date(f.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td>{(f.resources && f.resources.length > 0) ? f.resources.join(', ') : '—'}</td>
                <td>
                  <select
                    value={f.status}
                    onChange={e => handleStatusChange(f.id, e.target.value)}
                  >
                    {Object.keys(statusLabels).map(key => (
                      <option key={key} value={key}>
                        {statusLabels[key]}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
