// Configura o roteador do Express e importa o controlador de recursos
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Define as rotas relacionadas aos recursos 
router.get('/', resourceController.listResources);
router.post('/allocate', resourceController.allocateResource);
router.get('/counts', resourceController.countResourcesByType);

// Exporta o roteador para uso na aplicação principal
module.exports = router;
