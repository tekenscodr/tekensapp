const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    //username: {type: String, required: true},
    // eventName: { type: String},
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    ticketVariations:[
        { 
            name: {type: String, required:true},
            quantity: {type: String, required:true},
        }
],
    isScanned: { type: Boolean, default: false },
    timeScanned: { type: String,},
    initialPurchase: {type: String},
    transferedTicket: {type: String, default:"0"},
}, { timestamp: true })

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket