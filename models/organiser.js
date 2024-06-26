const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')


const organiserSchema = new Schema({
    organisationName: {
        type: String,
        required: true,
        default: "Tekens",
    },
    userId: {
        type: String,
        required: true,
    },
    

})


organiserSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    return user;
}

organiserSchema.pre('save', async function(req, res, next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        // next()
    } catch (error) {
        next(error)
    }
})

organiserSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const Organiser = mongoose.model('organiser', organiserSchema)
module.exports = Organiser