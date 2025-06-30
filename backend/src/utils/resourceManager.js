// Remove a alocação de um recurso de determinado tipo para um voo específico
const { query } = require('./db');

async function deallocateResourceByType(flightId, type) {
  await query(`
    DELETE FROM allocations
    WHERE flight_id = $1 AND resource_id IN (
      SELECT id FROM resources WHERE type = $2
    )`, [flightId, type]);
}

module.exports = { deallocateResourceByType };
