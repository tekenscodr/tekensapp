const Organiser = require('../models/organiser');
const Saved = require('../models/saved')
require('dotenv');
const { organiserRegister, loginSchema } = require('../helpers/validation_schema')
const {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken
} = require('../helpers/jwt_helper')

const register = async(req, res, next) =>{
    try {
        const result = await organiserRegister.validateAsync(req.body);
    
        const doesExist = await Organiser.findOne({ email: result.email });
        if (doesExist) {
            return res.status(409).json({ message: "already registered" });
        }

        // TODO: add if empty to API            
        const organiser = new Organiser(result);
        const savedOrganiser = await organiser.save();
        res.status(200).json(savedOrganiser);
    } catch (error) {
        next(error)
        return res.status(409).json({ message: error.message });
    }
}

const login = async(req, res, next) => {
    try {
        const result = await loginSchema.validateAsync(req.body)
        const organiser = await Organiser.findOne({ email: result.email })
        if (!organiser) throw createError.NotFound("User not registered")
        
        //TODO: add if empty to api
        const isMatch = await organiser.isValidPassword(result.password)
        if (!isMatch)
            throw createError.Unauthorized("email/password not valid");

        const token = await signAccessToken(organiser.id);
            // const refreshToken = await signRefreshToken(customer.id)

            res.status(200).json({ token, ...organiser._doc });
    } catch (error) {
        if (error.isJoi === true)
            res.status(500).json("Invalid Email/Password " + `${error}`)
        next(error)   
    }
}

const mostSavedEventsByOrganiser = async(req, res, next) => {
    try {
        const results = await Saved.aggregate([
            {
              $match: {
                userId: '6564fb47986fd44624ae656b',
              },
            },
            {
              $group: {
                _id: '$eventId',
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
            {
              $limit: 10, // Get the top 10 most saved events
            },
          ]);
          return res.status(200).json({message: 'Events Found', data: results})
    } catch (error) {
        return res.status(200).json({message: error.message})
    }
}

module.exports = {
    register,
    login,
    mostSavedEventsByOrganiser,
}