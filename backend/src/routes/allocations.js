// Importa o Express e inicializa o roteador
const express = require('express');
const router = express.Router();

// Importa o controlador responsável pelas alocações
const allocationController = require('../controllers/allocationController');

// Atribuicao das Rotas
router.post('/', allocationController.allocateResource);

router.get('/', allocationController.listAllocations);

router.patch('/:allocationId/release', allocationController.releaseResource);

// Exporta o roteador para uso na aplicação principal
module.exports = router;
