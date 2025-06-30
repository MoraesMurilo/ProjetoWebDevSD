// Libera automaticamente os recursos de acordo com o status do voo e emite evento via socket
const pool = require('./db');
const { getIO } = require('./socket'); 

const releaseResourcesByStatus = async (flightId, status) => {
  const io = getIO();

  const releaseTypes = {
    'boarding complete': ['vehicle', 'service'],
    'departed': ['gate', 'runway', 'hangar']
  };

  const typesToRelease = releaseTypes[status];
  if (!typesToRelease) return [];

  const released = [];

  for (const type of typesToRelease) {
    const result = await pool.query(
      `UPDATE allocations
       SET released_at = NOW()
       WHERE flight_id = $1
         AND released_at IS NULL
         AND resource_id IN (
           SELECT id FROM resources WHERE type = $2
         )`,
      [flightId, type]
    );

    if (result.rowCount > 0) {
      released.push(type);
      io.emit('resourceFreed', { flightId, type });
    }
  }

  return released; 
};

module.exports = { releaseResourcesByStatus };
