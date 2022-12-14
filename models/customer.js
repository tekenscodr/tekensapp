const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const ticket =require('./qrcode-model')


const customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    // ticket:[{ticketSchema}]
})


customerSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    return user;
}

customerSchema.pre('save', async function(req, res, next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

customerSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const Customer = mongoose.model('customer', customerSchema)
module.exports = Customer