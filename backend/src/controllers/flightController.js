const pool = require('../utils/db');
const { query } = require('../utils/db');
const { getIo } = require('../utils/socket');
const { releaseResourcesByStatus } = require('../utils/releaseResources');
const getFlightWithResources = require('../utils/getFlightWithResources');

// Lista todos os voos com recursos (incluindo gates como tipo)
async function listFlights(req, res) {
  try {
    const result = await query(`
      SELECT f.*,
        ARRAY_AGG(r.code) FILTER (WHERE a.released_at IS NULL) AS resources
      FROM flights f
      LEFT JOIN allocations a ON f.id = a.flight_id
      LEFT JOIN resources r ON a.resource_id = r.id
      GROUP BY f.id
      ORDER BY f.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar voos:', err);
    res.status(500).json({ error: 'Erro ao listar voos' });
  }
}


// Retorna um voo específico
async function getFlight(req, res) {
  const { id } = req.params;
  try {
    const flight = await getFlightWithResources(id);
    if (!flight) return res.status(404).json({ error: 'Voo não encontrado' });
    res.json(flight);
  } catch (err) {
    console.error('Erro ao buscar voo:', err);
    res.status(500).json({ error: 'Erro ao buscar voo' });
  }
}

// Cria um novo voo
const createFlight = async (req, res) => {
  const { number, origin, destination, scheduled_at } = req.body;

  try {
    await pool.query(
      `INSERT INTO flights (number, origin, destination, scheduled_at, status)
       VALUES ($1, $2, $3, $4, 'scheduled')`,
      [number, origin, destination, scheduled_at]
    );
    res.status(201).json({ message: 'Voo criado com sucesso' });
  } catch (err) {
    console.error('Erro ao criar voo:', err.stack || err);
    res.status(500).json({ error: 'Erro ao criar voo' });
  }
};

// Atualiza status do voo e libera recursos automaticamente
async function updateFlight(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await query(
      'UPDATE flights SET status = $1 WHERE id = $2',
      [status, id]
    );

    const releasedTypes = await releaseResourcesByStatus(id, status) || [];

    if (req.io && releasedTypes.length > 0) {
      releasedTypes.forEach(type => {
        req.io.emit('resourceFreed', { flightId: id, type });
      });
    }

    const updated = await getFlightWithResources(id);
    req.io?.emit('flightUpdated', updated);
    res.json(updated);
  } catch (err) {
    console.error('Erro ao atualizar status do voo:', err);
    res.status(500).json({ error: 'Erro ao atualizar status do voo' });
  }
}

// Remove voo
async function deleteFlight(req, res) {
  const { id } = req.params;
  try {
    await query('DELETE FROM flights WHERE id = $1', [id]);
    getIo().emit('flightDeleted', { id: parseInt(id) });
    res.sendStatus(204);
  } catch (err) {
    console.error('Erro ao deletar voo:', err);
    res.status(500).json({ error: 'Erro ao deletar voo' });
  }
}


module.exports = {
  listFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
};
