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
            res.send('Events saved');
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getEvents = async(req, res, next) => {
    try {
    const events = await Event.find()
        res.status(200).json(events)
        console.log(events)
    } catch (err) {
        res.send('Error: ' + err.message)
    }
}


const nearMe = async(req, res, next) => {
    try {
     const events = await Event.find({
        $geoNear: {
            near: {type: "Point", 
                    coordinates: [
                        parseFloat(req.query.lng), 
                        parseFloat(req.query.lat)]},
            maxDistance: 100000,
             spherical: true 
            
    }
    })
    res.status(200).json(events)
        
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
module.exports = { 
                    createEvent, 
                    getEvents, 
                    getID,
                    nearMe,}

      // const events = await Event.find()
        // res.json(events)
        // Event.geoNear({type: "Point", coordinates: [parseFloat(req.params.lng), parseFloat(req.params.lat)]},
        // {maxDistance: 100000, spherical: true}
        // ).then((events)=>{
        //     res.send(events)
        // })
