// Importa o React, hook de estado, a API para requisições HTTP e os estilos do formulário
import React, { useState } from 'react';
import api from '../services/api';
import './FlightForm.css';

// Componente de formulário para criar um novo voo
export default function NewFlightForm({ onFlightAdded }) {
  // Estado do formulário e mensagem de erro
  const [form, setForm] = useState({
    number: '',
    origin: '',
    destination: '',
    scheduled_at: ''
  });
  const [error, setError] = useState('');

  // Valida o formato do número do voo (ex: ABC1234)
  const isValidFlightNumber = (number) => /^[A-Z]{3}\d{4}$/i.test(number);

  // Valida o formato do horário (ex: 02:30 PM)
  const isValidTime = (time) => /^(0[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i.test(time);

  // Converte o horário em string para o formato ISO (padrão do banco)
  const parseToISOTime = (time) => {
    const now = new Date();
    const date = new Date(`${now.toDateString()} ${time}`);
    return date.toISOString();
  };

  // Função chamada ao enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validações do formulário
    if (!isValidFlightNumber(form.number)) {
      return setError('Número do voo deve ser 3 letras seguidas de 4 dígitos (ex: ABC1234)');
    }
    if (!form.origin || !form.destination) {
      return setError('Origem e destino são obrigatórios');
    }
    if (!isValidTime(form.scheduled_at)) {
      return setError('Horário deve estar no formato hh:mm AM/PM (ex: 02:30 PM)');
    }

    setError('');

    try {
      // Envia os dados do voo para o backend
      await api.post('/flights', {
        number: form.number.toUpperCase(),
        origin: form.origin.toUpperCase(),
        destination: form.destination.toUpperCase(),
        scheduled_at: parseToISOTime(form.scheduled_at)
      });

      // Limpa o formulário e notifica sucesso
      setForm({ number: '', origin: '', destination: '', scheduled_at: '' });
      if (onFlightAdded) onFlightAdded();
      alert('Voo criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar voo:', err);
      alert('Erro ao criar voo.');
    }
  };

  // JSX do formulário
  return (
    <form className="new-flight-form" onSubmit={handleSubmit}>
      <h3>Adicionar novo voo</h3>
      <input
        type="text"
        placeholder="Número do voo (ABC1234)"
        value={form.number}
        onChange={e => setForm({ ...form, number: e.target.value.toUpperCase() })}
      />
      <input
        type="text"
        placeholder="Origem"
        value={form.origin}
        onChange={e => setForm({ ...form, origin: e.target.value })}
      />
      <input
        type="text"
        placeholder="Destino"
        value={form.destination}
        onChange={e => setForm({ ...form, destination: e.target.value })}
      />
      <input
        type="text"
        placeholder="Horário (02:30 PM)"
        value={form.scheduled_at}
        onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
      />
      {/* Exibe mensagem de erro, se houver */}
      {error && <p className="form-error">{error}</p>}
      <button type="submit">Criar Voo</button>
    </form>
  );
}
