const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scannersSchema = new Schema({
    scanners: {
    mobile: {type: String},
    otp: {type: String},
    },
    eventId: {type: String, required: true}
})

const Scanners = mongoose.model('scanner', scannersSchema)

module.exports = Scanners