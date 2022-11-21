const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ticketSchema = new Schema({
    username: {type: String, required: true},
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    islinked: { type: Boolean, default: false },
}, { timestamp: true })

const Ticket = mongoose.model('Ticket', ticketSchema)

module.exports = Ticket