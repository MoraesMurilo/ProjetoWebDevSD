// Configura o roteador do Express e importa o controlador de voos
const express = require('express');
const router = express.Router();
const controller = require('../controllers/flightController');

// Atribuicao das rotas
router.get('/', controller.listFlights);

router.get('/:id', controller.getFlight);

router.post('/', controller.createFlight);

router.patch('/:id', controller.updateFlight);

router.delete('/:id', controller.deleteFlight);


module.exports = router;

