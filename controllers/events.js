const Event = require('../models/event-model')
const User = require('../models/customer');
const createError = require('http-errors')
require('dotenv')
const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { eventNames } = require('../models/event-model');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));



const bucketName = process.env.AWS_BUCKET_NAME
const region= process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY



const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: region
});

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const createEvent = async(req, res, next) => {
    try {
        // const command = new PutObjectCommand (params)
        // await s3.send(command)
  
        const doesExist = await Event.findOne({ title: req.body.title });
        if (doesExist)
            throw createError.Conflict(`${req.body.title} already exists`)
            const imageName = randomImageName();
            const params ={
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }
        const command = new PutObjectCommand(params)
        await s3.send(command)
        
        
        const savedEvents = await Event(req.body)
        savedEvents.banner = imageName    

        console.log(req.file)

        
      

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
    
    for(const event of events) {
    event.imageUrl = 'https://d1v5yq7t85t3r8.cloudfront.net'+ event.imageName;
    }
    res.status(200).json(events);
    } catch (err) {
        res.json('Error: '+ err.message);
    }
}


// POST REQUEST ****** SAVED EVENTS
const eventSave = async(req, res, next) => {
    try {
        let userId = await req.payload;
        let eventId = await fetch('http://localhost:3000/events/:id')
        .then(res => res.json())
        const saved = new Saved({
            userId: userId,
            eventId: eventId
        });
        saved.save()
        res.status(200).json(saved);   
    } catch (err){
        res.status(500).json('Error: '+ err.message)
        next(err)
    }
}

// GET REQUEST ********GET ALL SAVED
const savedEvents = async(req, res, next) => {
    try {
        let userId = await req.payload;
        const events = await Saved.findMany({userId:userId})
        res.status(200).json(events);
    } catch (err) {
    res.status(500).json(err)
    }
}


//GET REQUEST ******* GET ALL EVENTS NEAR BY
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
    let event
    try {
         event = await Event.findById(req.params.id)        
        if (id == null) {
         return res.status(400).json({message: 'Cannot find event'})
        }
         return res.status(200).json(id._id);

    } catch (err) {
        return res.status(500).json('Error: ' + err.message)
    }
    res.event = event
    next()
}
module.exports = { 
                    createEvent, 
                    getEvents,
                    eventSave,
                    savedEvents, 
                    getID,
                    nearMe,}

      // const events = await Event.find()
        // res.json(events)
        // Event.geoNear({type: "Point", coordinates: [parseFloat(req.params.lng), parseFloat(req.params.lat)]},
        // {maxDistance: 100000, spherical: true}
        // ).then((events)=>{
        //     res.send(events)
        // })
