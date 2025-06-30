// Configura o roteador do Express e importa o controlador de portões
const express = require('express');
const router = express.Router();
const { listGates } = require('../controllers/gateController');

// Define a rota para listar os portões disponíveis
router.get('/', listGates);

// Exporta o roteador para uso na aplicação principal
module.exports = router;
