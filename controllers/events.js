const Event = require('../models/event-model')
const User = require('../models/customer');
const Saved = require('../models/saved')
const createError = require('http-errors')
require('dotenv')
const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { eventNames } = require('../models/event-model');
const Scanners = require('../models/scanner');
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
       
        //     const imageName = randomImageName();
        //     const params ={
        //     Bucket: bucketName,
        //     Key: imageName,
        //     Body: req.file.buffer,
        //     ContentType: req.file.mimetype,
        //     }
        // const command = new PutObjectCommand(params)
        // await s3.send(command)
    
        const savedEvents = await Event(req.body)
        // savedEvents.banner = imageName    
        // console.log(req.file)
        savedEvents.save().then(item => {
            res.status(201).json({message: "Event saved"})
        })

       
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const getEvents = async(req, res, next) => {
try {
    const events = await Event.find()
    
    // for(const event of events) {
    // event.imageUrl = 'https://d1v5yq7t85t3r8.cloudfront.net'+ event.imageName;
    // }
    // if(events.length === 0){
    //     res.status(200).json({"message":"No record found"})
    // }
    res.status(200).json(events);
    } catch (err) {
        res.json('Error: '+ err.message);
    }
}


// POST REQUEST ****** SAVED EVENTS
const eventSave = async(req, res, next) => {
    try {
        let userId = await req.payload
        let eventId = await req.params.eventId
        console.log(eventId);
        const saved = new Saved({
            userId: userId,
            eventId: eventId,
        });
        saved.save()
        res.status(201).json(saved);   
    } catch (err){
        res.status(500).json('Error: '+ err.message)
        next(err)
    }
}

const getEventsByCategory = async(req,res,next)=>{
    try {
        const category = await req.params.category
        const events = await Event.find({category:category});
        if (!events) {
            res.status(500).json({message: "No records found"})
        }
        res.status(200).json({message: "No records found", events})
    } catch (error) {
        res.status(500).json({message: `An error occurred: ${error}`});
        next(error)
    }
}

// GET REQUEST ********GET ALL SAVED
const getSavedEvents = async (req, res, next) => {
    try {
        const userId = req.payload;
        const results = await Saved.find({ userId: userId });
        if (results.length === 0 || !userId) {
            return res.status(200).json({ "message": "No records found" });
        }

        const eventIds = results.map(result => result.eventId); // Extracting event IDs
        const events = await Event.find({ _id:  eventIds }); // Querying events by IDs

        if (events.length === 0) {
            console.log(events.length);
            return res.status(200).json({ "message": "No records found" });
        }
        // for(const event of events) {
        //     event.imageUrl = 'https://d1v5yq7t85t3r8.cloudfront.net'+ event.imageName;
        //     }

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





//TODO Search Route
const search = async(req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).json(error)
        next(error)
    }
}
module.exports = { 
        createEvent, 
        getEvents,
        eventSave,
        getSavedEvents, 
        getID,
        nearMe,
        search,
        getEventsByCategory,
    }

      // const events = await Event.find()
        // res.json(events)
        // Event.geoNear({type: "Point", coordinates: [parseFloat(req.params.lng), parseFloat(req.params.lat)]},
        // {maxDistance: 100000, spherical: true}
        // ).then((events)=>{
        //     res.send(events)
        // })
