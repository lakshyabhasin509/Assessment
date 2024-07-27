const express = require('express');
const router = express.Router();
const { uploadCSV } = require('../controllers/uploadControl.js');

// POST /api/upload
router.post('/', uploadCSV);

module.exports = router;