// Módulo para inicializar e acessar a instância do Socket.io
let io;

module.exports = {
  // Inicializa o Socket.io com permissões de CORS e associa ao servidor HTTP
  init: (server) => {
    io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });
    return io;
  },

  // Retorna a instância atual do Socket.io (ou lança erro se não foi inicializada)
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io não inicializado!');
    }
    return io;
  }
};
