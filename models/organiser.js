const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')


const organiserSchema = new Schema({
    organisationName: {
        type: String,
        required: true,
        default: "Tekens",
        unique: true
    },
    userId: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }

})

const Organiser = mongoose.model('organiser', organiserSchema)
module.exports = Organiser