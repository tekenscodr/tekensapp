const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    ticketId: {type: String, required: true},
    buyerId: {type: String, required: true},
    buyeeId: {type: String, required: false},
    referenceId: {type: String, required: true},

},
{timestamps:true},
)

const Purchase = mongoose.model('purchase', purchaseSchema);
module.exports = Purchase