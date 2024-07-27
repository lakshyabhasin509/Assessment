const express = require('express');
const router = express.Router();
const { checkStatus } = require('../controllers/statusControl.js');

// GET /api/status/:requestId
router.get('/:requestId', checkStatus);

module.exports = router;