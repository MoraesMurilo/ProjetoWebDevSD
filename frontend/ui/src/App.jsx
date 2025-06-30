// Importações de bibliotecas e componentes
import React, { useState, useEffect } from 'react';
import './styles.css';
import FlightTable from './components/FlightTable';
import ResourceSelector from './components/ResourceSelector';
import FlightForm from './components/FlightForm';
import './components/FlightForm.css';
import api from './services/api';

// Componente principal da aplicação
export default function App() {
  // Estados para seleção de voo e tipo de recurso
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flights, setFlights] = useState([]);
  const [resourceType, setResourceType] = useState('runway');

  // Estados para exibir métricas no topo do dashboard
  const [totalFlights, setTotalFlights] = useState(0);
  const [freeResources, setFreeResources] = useState(0);
  const [freeRunways, setFreeRunways] = useState(0);
  const [freeVehicles, setFreeVehicles] = useState(0);
  const [freeHangars, setFreeHangars] = useState(0);
  const [freeServices, setFreeServices] = useState(0);
  const [freeGates, setFreeGates] = useState(0);

  // Busca os voos cadastrados na API
  const fetchFlights = () => {
    api.get('/flights')
      .then(res => {
        setFlights(res.data);
        setTotalFlights(res.data.length);
      })
      .catch(console.error);
  };

  // Busca as métricas de recursos disponíveis por tipo
  const fetchMetrics = () => {
    api.get('/resources?free=true')
      .then(res => setFreeResources(res.data.length))
      .catch(console.error);

    api.get('/resources?type=runway&free=true')
      .then(res => setFreeRunways(res.data.length))
      .catch(console.error);

    api.get('/resources?type=vehicle&free=true')
      .then(res => setFreeVehicles(res.data.length))
      .catch(console.error);

    api.get('/resources?type=hangar&free=true')
      .then(res => setFreeHangars(res.data.length))
      .catch(console.error);

    api.get('/resources?type=service&free=true')
      .then(res => setFreeServices(res.data.length))
      .catch(console.error);

    api.get('/resources?type=gate&free=true')
      .then(res => setFreeGates(res.data.length))
      .catch(console.error);
  };

  // Atualiza os dados sempre que um voo é selecionado
  useEffect(() => {
    fetchFlights();
    fetchMetrics();
  }, [selectedFlight]);

  // JSX principal da aplicação
  return (
    <div className="app-container">
      {/* Cabeçalho da aplicação */}
      <header className="app-header">
        <h1 className="app-title">Airport Control Dashboard</h1>
      </header>

      {/* Seção com métricas rápidas sobre voos e recursos */}
      <nav className="app-metrics">
        <div className="metric-card"><h3 className="metric-title">Voos Ativos</h3><p className="metric-value">{totalFlights}</p></div>
        <div className="metric-card"><h3 className="metric-title">Recursos Livres</h3><p className="metric-value">{freeResources}</p></div>
        <div className="metric-card"><h3 className="metric-title">Pistas Livres</h3><p className="metric-value">{freeRunways}</p></div>
        <div className="metric-card"><h3 className="metric-title">Veículos Livres</h3><p className="metric-value">{freeVehicles}</p></div>
        <div className="metric-card"><h3 className="metric-title">Hangars Livres</h3><p className="metric-value">{freeHangars}</p></div>
        <div className="metric-card"><h3 className="metric-title">Serviços Disponíveis</h3><p className="metric-value">{freeServices}</p></div>
        <div className="metric-card"><h3 className="metric-title">Portões Livres</h3><p className="metric-value">{freeGates}</p></div>
      </nav>

      {/* Conteúdo principal */}
      <main className="app-main container">

        {/* Seção de cadastro de voos */}
        <section className="section">
          <h2 className="section-title">Adicionar Novo Voo</h2>
          <FlightForm onFlightAdded={fetchMetrics} />
        </section>

        {/* Seção de listagem e seleção de voos */}
        <section className="section">
          <h2 className="section-title">Tabela de Voos</h2>
          <FlightTable
            selectedFlight={selectedFlight}
            onSelectFlight={setSelectedFlight}
            flights={flights}
          />
        </section>

        {/* Seção de alocação de recursos para o voo selecionado */}
        <section className="section">
          <h2 className="section-title">Alocação de Recursos</h2>

          {selectedFlight ? (
            <>
              {/* Dropdown para escolher o tipo de recurso */}
              <div className="resource-type-selector" style={{ marginBottom: '1rem' }}>
                <label htmlFor="resourceType">Tipo de Recurso:&nbsp;</label>
                <select
                  id="resourceType"
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value)}
                >
                  <option value="runway">Pistas</option>
                  <option value="vehicle">Veículos</option>
                  <option value="hangar">Hangars</option>
                  <option value="service">Serviços</option>
                  <option value="gate">Portões</option>
                </select>
              </div>

              {/* Componente de alocação com atualização automática ao concluir */}
              <ResourceSelector
                flightId={selectedFlight}
                type={resourceType}
                onAllocated={() => {
                  fetchFlights();
                  fetchMetrics();
                }}
              />
            </>
          ) : (
            // Mensagem quando nenhum voo está selecionado
            <div className="placeholder-box">
              <p className="placeholder-text">Selecione um voo acima para alocar recursos.</p>
            </div>
          )}
        </section>
      </main>

      {/* Rodapé da aplicação */}
      <footer className="app-footer">
        <small>© {new Date().getFullYear()} Aeroporto</small>
      </footer>
    </div>
  );
}
