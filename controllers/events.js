const Event = require('../models/event-model')
const createError = require('http-errors')
require('dotenv')
const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const client = new S3Client(clientParams);



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

const randomImageName = (bytes = 32) => crypto.randomImageName(bytes).toString('hex')

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
        savedEvents.banner = randomImageName()    

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
    const getObjectParams = {
        Bucket: bucketName,
        Key: event.imageName,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command);
    event.imageUrl = url;
    }
    res.status(200).json(events)
    

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
