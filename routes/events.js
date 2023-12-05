const express = require('express')
const router = express.Router()
const Event = require('../controllers/events')
const upload = require('../helpers/img_upload')

router.post('/create', upload.single('banner'), Event.createEvent)
router.get('/', Event.getEvents)
router.get('/:eventId')
router.get('/nearme', Event.nearMe)
router.get('/saved', Event.eventSave)

// router.get('/get', Event.getEvents)

router.get('/:id', Event.getID)


module.exports = router
