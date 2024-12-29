const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')

// GET REQUESTS
router.get('/attended', verifyAccessToken, Ticket.attended) 
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/canceled', verifyAccessToken, Ticket.canceledTicket)
 
router.get('/pay/:userId/:price', Ticket.ussdPurchase)
router.get('/getTicket/:id', verifyAccessToken, Ticket.eachTicket);
router.get('/scanner', Ticket.scannedTicket)

// POST REQUESTS
router.post('/transferTicket', verifyAccessToken, Ticket.transferTicket)
router.post('/save/:eventId/:referenceId', verifyAccessToken, Ticket.purchaseWebApp)

// PUT REQUESTS
router.put('/cancel/:ticketId', verifyAccessToken, Ticket.cancelTicket)
router.put('/scan/:ticketId', verifyAccessToken, Ticket.scanTicket)

module.exports = router
