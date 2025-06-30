// Função que retorna um voo com os códigos dos recursos atualmente alocados (ainda não liberados)
const { query } = require('./db');

async function getFlightWithResources(id) {
  const result = await query(`
    SELECT f.*,
           ARRAY_AGG(r.code) FILTER (WHERE a.released_at IS NULL) AS resources
    FROM flights f
    LEFT JOIN allocations a ON f.id = a.flight_id
    LEFT JOIN resources r ON a.resource_id = r.id
    WHERE f.id = $1
    GROUP BY f.id
  `, [id]);

  return result.rows[0];
}

module.exports = getFlightWithResources;
