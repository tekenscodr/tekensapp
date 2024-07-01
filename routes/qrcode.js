const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')

router.get('/attended', verifyAccessToken, Ticket.attended) 
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/canceled', verifyAccessToken, Ticket.canceledTicket)
router.get('/scanner', Ticket.scannerTicket) 
router.post('/transferTicket', verifyAccessToken, Ticket.updateTicket)
router.post('/save/:eventId/:referenceId', verifyAccessToken, Ticket.saveTicket)
router.get('/pay/:userId/:price', Ticket.buyTicket)
router.get('/getTicket/:id', verifyAccessToken, Ticket.eachTicket);
router.put('/cancel/:ticketId', verifyAccessToken, Ticket.cancelTicket)

module.exports = router
