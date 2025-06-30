// Importa a conexão com o banco de dados e função utilitária para buscar voo com recursos
const pool = require('../utils/db');
const getFlightWithResources = require('../utils/getFlightWithResources');

// Variável para armazenar a instância do socket.io
let io = null;

// Função para definir a instância do socket.io usada para emitir eventos
function setSocket(ioInstance) {
  io = ioInstance;
}

// Lista os recursos com filtros opcionais por tipo e disponibilidade
exports.listResources = async (req, res) => {
  const { type, free } = req.query;

  try {
    let query = `SELECT * FROM resources`;
    let params = [];

    if (type || free) {
      query += ` WHERE`;

      if (type) {
        query += ` type = $1`;
        params.push(type);
      }

      if (free) {
        // Se já há filtro por tipo, adiciona o operador AND
        if (type) {
          query += ` AND`;
        }

        // Filtra recursos que não estão alocados (ou seja, estão livres)
        query += ` id NOT IN (
          SELECT resource_id FROM allocations WHERE released_at IS NULL
        )`;
      }
    }

    // Executa a consulta e retorna os recursos
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar recursos:', err);
    res.status(500).json({ error: 'Erro ao listar recursos' });
  }
};

// Conta quantos recursos existem por tipo, e quantos estão livres
exports.countResourcesByType = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT type,
        COUNT(*) FILTER (WHERE id NOT IN (
          SELECT resource_id FROM allocations WHERE released_at IS NULL
        )) AS free,
        COUNT(*) AS total
      FROM resources
      GROUP BY type
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao contar recursos:', err);
    res.status(500).json({ error: 'Erro ao contar recursos' });
  }
};

// Aloca um recurso específico para um voo
exports.allocateResource = async (req, res) => {
  const { flightId, resourceId } = req.body;

  try {
    // 1. Verifica se o recurso existe e obtém seu tipo
    const resourceResult = await pool.query(
      'SELECT type FROM resources WHERE id = $1',
      [resourceId]
    );
    if (resourceResult.rowCount === 0) {
      return res.status(400).json({ error: 'Recurso inexistente' });
    }
    const { type } = resourceResult.rows[0];

    // 2. Verifica se já existe um recurso do mesmo tipo alocado para o voo
    const existing = await pool.query(`
      SELECT 1
      FROM allocations a
      JOIN resources r ON r.id = a.resource_id
      WHERE a.flight_id = $1 AND r.type = $2 AND a.released_at IS NULL
    `, [flightId, type]);

    if (existing.rowCount > 0) {
      return res.status(409).json({ error: `Já existe um recurso do tipo "${type}" alocado para este voo.` });
    }

    // 3. Faz a alocação do recurso
    const allocation = await pool.query(
      'INSERT INTO allocations (flight_id, resource_id) VALUES ($1, $2) RETURNING *',
      [flightId, resourceId]
    );

    // 4. Emite evento via socket para atualizar o voo no frontend
    if (io) {
      const updatedFlight = await getFlightWithResources(flightId);
      io.emit('flightUpdated', updatedFlight);
    }

    res.status(201).json(allocation.rows[0]);
  } catch (err) {
    console.error('Erro ao alocar recurso:', err);
    res.status(500).json({ error: 'Erro ao alocar recurso' });
  }
};

// Exporta a função que define o socket
exports.setSocket = setSocket;
