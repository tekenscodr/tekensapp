const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    eventId: { 
        type: String, 
        required: true },
    userId: { 
        type: String, 
        required: true },
    ticketVariations:[
        { 
            name: {type: String, required:true},
            quantity: {type: String, required:true},
            price: {type: String, required:true},

        }
],
    qrcode: {type:String, required:true},
    isCanceled: {
         type:Boolean, 
        default:false },
    isScanned: { 
        type: Boolean, 
        default: false },
    isActive: {
        type: Boolean,
        default: true,
    },
    timeScanned: { 
        type: String,
        
    },
    initialPurchase: {
        type: String
        
    },
    transferedTicket: [
        {
            user: {
                type: String, 
            },
            quantity: {
                type: String, 
            },
        }
    ],
    transferedFrom: {
        type: String, 
        
    }
}, { timestamp: true })

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket