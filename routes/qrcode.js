const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')


router.get('/:id/:refernceId', verifyAccessToken, Ticket.saveTicket)
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/scanner', Ticket.scannerTicket) //gets organisers scanned tickets
router.get('/pay/:userId/:price', Ticket.buyTicket)
router.post('/transferTicket', verifyAccessToken, Ticket.updateTicket)
router.get('/:id', verifyAccessToken, Ticket.eachTicket);
// CUSTOMER ROUTES **CANCEL**ATTENDED/SCANNED**CURRENT/UPCOMING
router.put('cancel-ticket/:tickeId', verifyAccessToken, Ticket.cancelTicket)
router.get('/scanned', verifyAccessToken, Ticket.scannedTicket) //get users attended events 


module.exports = router
