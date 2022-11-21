const Event = require('../models/event-model')
const createError = require('http-errors')


const createEvent = async(req, res, next) => {
    try {
        const doesExist = await Event.findOne({ title: req.body.title });
        if (doesExist)
            throw createError.Conflict(`${req.body.title} already exists`)
        const savedEvents = await Event(req.body)
        if(req.file){
          savedEvents.banner = req.file.path   
        }
        savedEvents.save().then(item => {
            res.send('item saved');
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getEvents = async(req, res) => {
    try {
        const events = await Event.find()
        res.json(events)
    } catch (err) {
        res.send('Error: ' + err.message)
    }
}


const getID = async(req, res, next) => {
    try {
        const id = await Event.findById(req.params.id)
        res.json(id._id);
    } catch (err) {
        res.send('Error: ' + err.message)
        next(err)
    }
}
module.exports = { createEvent, getEvents, getID }
