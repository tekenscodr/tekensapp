const express = require('express')
const router = express.Router()
const Scanner = require('../controllers/scanner')

// GET REQUEST
// router.get('/get-scanners', Scannner. )
router.get('/get-scanners/:eventId',  Scanner.getScanner)


// POST REQUEST
router.post('/add-scanner', Scanner.addScanner)


module.exports = router;