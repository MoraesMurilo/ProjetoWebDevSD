require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Importa rotas
const flightRoutes = require('./src/routes/flights');
const resourceRoutes = require('./src/routes/resources'); // cuida de /resources e /resources/allocate
const allocationRoutes = require('./src/routes/allocations'); // opcional se quiser separar
const flightsRouter = require('./src/routes/flights');


const app = express();
const server = http.createServer(app);
const socket = require('./src/utils/socket');
const io = socket.init(server);
app.use((req, res, next) => {
  req.io = io;
  next();
});

const allocationController = require('./src/controllers/allocationController');
allocationController.setSocket(io);
const resourceController = require('./src/controllers/resourceController');
resourceController.setSocket(io);

// Middleware de log para depuração
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// Monta rotas REST
app.use('/api/v1/flights', flightRoutes);
app.use('/api/v1/resources', resourceRoutes);  // /resources e /resources/allocate
app.use('/api/v1/allocations', allocationRoutes); // se quiser manter isso separado
app.use('/api/v1/flights', flightsRouter);


// WebSocket
io.on('connection', (socket) => {
  console.log('Usuário conectado:', socket.id);
});

// Inicia o servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

// Exporta io para uso em controllers
module.exports = { app, server };
