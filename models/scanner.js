const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const scannersSchema = new Schema({
    scanners: [
      {
        mobile: { type: String, required: true },
        otp: { type: String, required: true },
      },
    ],
    eventId: { type: String, required: true },
  });
const Scanners = mongoose.model('scanner', scannersSchema)

module.exports = Scanners