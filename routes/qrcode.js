const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')


router.post('/:eventId/:referenceId', verifyAccessToken, Ticket.saveTicket)
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/scanner', Ticket.scannerTicket) //gets organisers scanned tickets
router.get('/pay/:userId/:price', Ticket.buyTicket)
router.post('/transferTicket', verifyAccessToken, Ticket.updateTicket)
router.get('/:id', verifyAccessToken, Ticket.eachTicket);
router.get('/scanned', verifyAccessToken, Ticket.attended) //get users attended events 
router.get('/canceled', verifyAccessToken, Ticket.canceledTicket) //get users attended events 
// CUSTOMER ROUTES **CANCEL**ATTENDED/SCANNED**CURRENT/UPCOMING
router.put('cancel-ticket/:tickeId', verifyAccessToken, Ticket.cancelTicket)

module.exports = router
