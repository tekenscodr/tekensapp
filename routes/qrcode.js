const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')

router.post('/create', Ticket.saveTicket)

// router.get('/ticket/events', Ticket.eventID)

//router.get('/ticket/user', Ticket.userID)

// router.get('/:id', Ticket.getCode)


module.exports = router
