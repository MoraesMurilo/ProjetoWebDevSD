const pool = require('../utils/db');

let io = null;

// Injeta o socket.io no controller
const setSocket = (ioInstance) => {
  io = ioInstance;
};

// Aloca recurso a um voo (apenas se ainda não estiver alocado)
const allocateResource = async (req, res) => {
  const { flightId, resourceId } = req.body;

  if (!flightId || !resourceId) {
    return res.status(400).json({ error: 'flightId e resourceId são obrigatórios.' });
  }

  try {
    // Verifica se já está alocado esse recurso a esse voo (ativo)
    const existing = await pool.query(
      `SELECT * FROM allocations 
       WHERE flight_id = $1 AND resource_id = $2 AND released_at IS NULL`,
      [flightId, resourceId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Recurso já está alocado a este voo.' });
    }

    // Insere nova alocação
    const result = await pool.query(
      `INSERT INTO allocations (flight_id, resource_id, created_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [flightId, resourceId]
    );

    const allocation = result.rows[0];

    // Emite evento de alocação via WebSocket se o socket foi setado
    if (io) {
      io.emit('resourceAllocated', allocation);
    }

    res.status(201).json(allocation);
  } catch (err) {
    console.error('Erro ao alocar recurso:', err);
    res.status(500).json({ error: 'Erro interno ao alocar recurso.' });
  }
};

// Lista alocações ativas
const listAllocations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, f.number AS flight_number, r.code AS resource_code, r.type
       FROM allocations a
       JOIN flights f ON a.flight_id = f.id
       JOIN resources r ON a.resource_id = r.id
       WHERE a.released_at IS NULL
       ORDER BY a.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar alocações:', err);
    res.status(500).json({ error: 'Erro interno ao buscar alocações.' });
  }
};

// Libera um recurso
const releaseResource = async (req, res) => {
  const { allocationId } = req.params;

  try {
    await pool.query(
      `UPDATE allocations SET released_at = NOW() WHERE id = $1`,
      [allocationId]
    );

    res.json({ message: 'Recurso liberado com sucesso.' });
  } catch (err) {
    console.error('Erro ao liberar recurso:', err);
    res.status(500).json({ error: 'Erro ao liberar recurso.' });
  }
};

module.exports = {
  allocateResource,
  listAllocations,
  releaseResource,
  setSocket, 
};
