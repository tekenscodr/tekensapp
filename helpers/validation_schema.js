const Joi = require('@hapi/joi')


// function generateAccountNumber() {
//     let num = ''
//     while (num.length < 10) {
//       num += Math.floor(Math.random() * 10)
//     }
//     return num
// }

// numberCreated = generateAccountNumber()


const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    phoneNumber: Joi.number().required(),
    password: Joi.string().min(8).required(),
    firstname: Joi.string().required(),
    surname: Joi.string().required()

})

const loginSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required()
})

module.exports = {
    authSchema,
    loginSchema,
}