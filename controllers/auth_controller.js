const createError = require('http-errors')
const Customer = require('../models/customer')
const { authSchema, loginSchema } = require('../helpers/validation_schema')
const {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')

module.exports = {
    register: async(req, res, next) => {

        try {
            const result = await authSchema.validateAsync(req.body)

            const doesExist = await Customer.findOne({ email: result.email })
            if (doesExist)
                return res.status(409).json({message: "already registered"})
            //TODO: add if empty to api 
            
            const customer = new Customer(result)
            const savedUser = await customer.save()
            //const token = await signAccessToken(savedUser.id)
            //const refreshToken = await verifyAccessToken(savedUser.id)

            res.status(200).json(savedUser); 
        } catch (error) {
            if (error === true) error.status = 422;
            res.status(422).json({error: error.message})
            next(error)
        }
    },


    login: async(req, res, next) => {
        try {
            const result = await loginSchema.validateAsync(req.body)
            const customer = await Customer.findOne({ email: result.email })
            if (!customer) throw createError.NotFound("User not registered")
            
            //TODO: add if empty to api

            const isMatch = await customer.isValidPassword(result.password)
            if (!isMatch)
                throw createError.Unauthorized("email/password not valid")

            const token = await signAccessToken(customer.id)
                // const refreshToken = await signRefreshToken(customer.id)

                res.status(200).json({ token, ...customer._doc });
            // res.cookie("token", accessToken, {
            //     httpOnly: true,
            //     secure: true,
            // });
        } catch (error) {
            if (error.isJoi === true)
                res.status(500).json("Invalid Email/Password")
            next(error)
        }
    },

    // getUser: async(req, res, next) => {
    //     try {
    //         let id = await "akbckabs";  
    //         res.json(id);
    //     }catch(err) {
    //         next(err)
    //     }
    // },

    // refreshToken: async(req, res, next) => {
    //     try {
    //         const { refreshToken } = req.body
    //         if (!refreshToken) throw createError.BadRequest()
    //         const userId = await verifyRefreshToken(refreshToken)

    //         const accessToken = await signAccessToken(userId)
    //             // const refToken = await signRefreshToken(userId)

    //         res.send({ accessToken: accessToken, refreshToken: refToken })
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    // logout: async (req, res, next) => {
    //     try {
    //         const { refreshToken } = req.body
    //         if (!refreshToken) throw createError.BadRequest()
    //         const userId = await verifyRefreshToken(refreshToken)
    //         client.DEL(userId, (err, val) => {
    //             if (err) {
    //                 console.log(err.message)
    //                 throw createError.InternalServerError()
    //             }
    //             console.log(val)
    //             res.sendStatus(204)
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    userId: async(req, res, next) => {
        try {
            const id = await Customer.findById(req.params.id)
            res.json(id);
        } catch (err) {
            res.send('Error: ' + err.message)
            next(err)
        }
    }
}