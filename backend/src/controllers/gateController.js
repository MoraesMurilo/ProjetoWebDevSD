const db = require('../utils/db');

// Listagem de portoes
async function listGates(req, res) {
  const { free } = req.query;
  try {
    let rows;
    if (free === 'true') {
      // Seleciona portoes não atribuídos a nenhum voo
      const q = `SELECT * FROM gates WHERE code NOT IN (SELECT gate FROM flights WHERE gate IS NOT NULL)`;
      ({ rows } = await db.query(q));
    } else {
      ({ rows } = await db.query('SELECT * FROM gates'));
    }
    res.json(rows);
  } catch (err) {
    console.error('Error listing gates:', err);
    res.status(500).json({ error: 'Erro ao listar gates.' });
  }
}

module.exports = { listGates };

