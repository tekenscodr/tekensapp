const express = require('express')
const router = express.Router()
const Ticket = require('../controllers/qrcode')
const {verifyAccessToken} = require('../helpers/jwt_helper')


router.get('/', verifyAccessToken, Ticket.saveTicket)
router.get('/pending', verifyAccessToken, Ticket.unscannedTicket)
router.get('/scanned', verifyAccessToken, Ticket.scannedTicket) //get users attended events 
router.get('/scanner', Ticket.scannerTicket) //gets organisers scanned tickets
router.get('/:id', verifyAccessToken, Ticket.eachTicket)
// router.get('/paid', Ticket.buyTicket)
router.get('/jehova', verifyAccessToken, Ticket.scannedTicket);


module.exports = router
