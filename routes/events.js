const express = require('express')
const router = express.Router()
const Event = require('../controllers/events')
const upload = require('../helpers/img_upload')
const { verifyAccessToken } = require('../helpers/jwt_helper')

router.post('/create', Event.createEvent)
router.get('/', Event.getEvents)
router.get('/:eventId')
router.get('/nearme', Event.nearMe)
router.post('/saved/:eventId', verifyAccessToken, Event.eventSave)
router.get('/saved', verifyAccessToken, Event.getSavedEvents)
router.get('/scanner/:id')
router.post('/scanner/login', Event.scanner)
router.get('/:category', Event.getEventsByCategory)
router.post('/scanner/add-scanner', Event.addScanner)
router.get('/:id', Event.getID)


module.exports = router
