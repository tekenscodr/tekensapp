const Event = require('../models/event-model')
const User = require('../models/customer');
const Saved = require('../models/saved')
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
            throw createError.Conflict(`${req.body.title} already exists`);
       
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
        let userId = await '6564fb47986fd44624ae656b'
        let eventId = await req.params.eventId
        console.log(eventId);
        const saved = new Saved({
            userId: userId,
            eventId: eventId,
        });
        saved.save()
        res.status(200).json(saved);   
    } catch (err){
        res.status(500).json('Error: '+ err.message)
        next(err)
    }
}

// GET REQUEST ********GET ALL SAVED
const getSavedEvents = async (req, res, next) => {
    try {
        const userId = req.payload;
        console.log(userId);
            if (!userId) {
                return res.status(400).json({ "message": "No user entered" });
            } else {
                res.status(200).json(userId);
            }

        const results = await Saved.find({ userId: userId });
        if (results.length === 0) {
            return res.status(200).json({ "message": "No records found" });
        }

        const eventIds = results.map(result => result.eventId); // Extracting event IDs
        const events = await Event.findById({ _id:  eventIds }); // Querying events by IDs

        if (events.length === 0) {
            console.log(events.length);
            return res.status(200).json({ "message": "No records found" });
        }

        res.status(200).json(events);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
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
        if (event == null) {
         return res.status(400).json({message: 'Cannot find event'})
        }
         return res.status(200).json(event);

    } catch (err) {
        return res.status(500).json('Error: ' + err.message)
    }

}


const scanner = async(req, res, next) => {
    try {
        const eventId = await req.params.eventId
        const event = await Event.findById(eventId)
        const scannerNumber = await req.body;
        const scannerMatch = await event.scanners.find(scanner => scanner.mobile === scannerNumber) //check this code before you parse

        if (scannerMatch) {
            res.status(200).json({ message: 'Mobile contact found in scanners array!' });
          } else {
            res.status(400).json({ message: 'Mobile contact not found in scanners array!' });
          }
        
    } catch (error) {
        return res.status(500).json('Error: ' + err.message)
    }
}
module.exports = { 
                    createEvent, 
                    getEvents,
                    eventSave,
                    getSavedEvents, 
                    getID,
                    nearMe,
                    scanner,
                }

      // const events = await Event.find()
        // res.json(events)
        // Event.geoNear({type: "Point", coordinates: [parseFloat(req.params.lng), parseFloat(req.params.lat)]},
        // {maxDistance: 100000, spherical: true}
        // ).then((events)=>{
        //     res.send(events)
        // })
