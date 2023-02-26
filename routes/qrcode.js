const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')


router.get('/', verifyAccessToken, Ticket.saveTicket)
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/scanned', verifyAccessToken, Ticket.scannedTicket) //get users attended events 
router.get('/scanner', Ticket.scannerTicket) //gets organisers scanned tickets
router.get('/pay/:userId/:price', Ticket.buyTicket)
// router.get('/jehova', Ticket.scannedTicket);
router.get('/:id', verifyAccessToken, Ticket.eachTicket);


module.exports = router
