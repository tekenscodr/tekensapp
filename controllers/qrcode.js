const createError = require('http-errors')
const Ticket = require('../models/qrcode-model')
const QRCode = require('qrcode')
const Event = require('../models/event-model')
const User = require('../models/customer');
const { find } = require('../models/qrcode-model');
const { default: mongoose } = require('mongoose');
const { populate } = require('../models/event-model');
const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const {init, verify} = require('../helpers/payment')
const axios = require('axios')
const https = require('https')

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const bucketName = process.env.CODE_BUCKET_NAME
    const region= process.env.CODE_BUCKET_REGION
    const accessKey = process.env.CODE_ACCESS_KEY
    const secretAccessKey = process.env.CODE_SECRET_KEY
    const s3 = new S3Client({
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretAccessKey,
        },
        region: region
    });
    
    const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
const saveTicket = async(req, res, next) =>{
    try {
        
        /******************** Get All The Data From Endpoints ************************/
        // const user = await fetch('http://localhost:3000/auth/:id')
        //     let userId = await user.json(user)

        const userId = await req.payload  
        const eventId = await fetch('https://tekensapp.vercel.app/events/63b4376894c8dd78b0d376e2')
            .then(res => res.json())

        // Save Ticket into database
        const ticket = new Ticket({
            userId: userId,
            eventId: eventId
        });
        const imageName = randomImageName();
        const code = await QRCode.toString(`${userId} + ${eventId}`, (err, data) =>{ 
            if(err) throw err;
            return data
        }) 
            const params ={
            Bucket: bucketName,
            Key: imageName,
            Body: code,
        }
        console.log (params)
        const command = new PutObjectCommand(params)
        await s3.send(command)

        ticket.eventName = imageName

        ticket.save()
        res.status(200).json(ticket)
        // const code = await QRCode
        // .toFile("./codegenerated/npp.png", 'https://newpatrioticparty.org/press-conference-by-the-new-patriotic-party-addressed-by-the-general-secretary/')
        // return res.status(200).json(code) 
    } catch (err) {
        res.json(err.message)
        next(err)
    }
}

/****GET TICKETS BOUGHT BY A PARTICULAR USER********/
const unscannedTicket = async(req, res, next) =>{
    try {
        
        let userId = await req.payload;  
        let tickets = await Ticket.find({userId:userId}).where({"isScanned": false});
        /** if condition*/
        if(tickets == 0) throw("There are no tickets");
        
        
        pending = await Promise.all(tickets.map(async (ticket) => {
            let event = await Event.findOne({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
            ticket.event_details = event
            
            return {
                ticket,
                event
             };
            }));
            res.json(pending);
    } catch (error) {
        next(error)
    }
}

/*******All Tickets Bought By A Particular User That Are Scanned*****/
const scannedTicket = async(req, res, next) =>{
    try {
        const userId = await req.payload  
        const tickets = await Ticket.find({userId:userId})
        .where({"isScanned": true})
        const scanned = await Promise.all(tickets.map(async ticket => {
            const event = await Event.findOne({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
             ticket.event_details = event
             //let cards = await ticket.push(...events)
             // cards = await events.push(...ticket)
             
              return {
                ticket,
                event
             };
            }))
            res.status(200).json(scanned);


    } catch (error) {
        next(error)
    }
}
const scannerTicket = async(req, res, next) =>{
    try {
        const eventId = await fetch
        ('http://localhost:3000/events/:id').then(res => res.json())
        
        const ticket = await Ticket.find({eventId:eventId}).where({"isScanned": true})
          res.status(200).json({ticket})
    } catch (error) {
        next(error)
    }
}

const eachTicket = async(req, res, next)=> {
    try {
        const event = await req.params.id
        //  const ticket = fetch()
        const ticket = await Ticket.findOne({_id : event})
            res.status(200).json(ticket)
    } catch (error) {
        next(error)
    }
}
const buyTicket = async(req, res, next) => {
    try {
        let userId = await req.params.userId
        const result = await User.findOne({_id: userId})
        let email = result.email
        console.log(email);
        const params = await JSON.stringify({
            "email": result.email,
            "amount": req.params.price
          })
          
          const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: '/transaction/initialize',
            method: 'POST',
            headers: {
              Authorization: 'Bearer sk_test_d4061fac60668a5522d7eddc0633749888de3b57',
              'Content-Type': 'application/json'
            }
          }
          
          const request = https.request(options, response => {
            let data = ''
          
            response.on('data', (chunk) => {
              data += chunk
            });
          
            response.on('end', () => {
              res.json(JSON.parse(data))
            })
          }).on('error', error => {
            console.error(error)
          })
          
          request.write(params)
          request.end()
    } catch (err) {
        res.status(500).json(err)
    }
}
/****Why are you not running */
const purchase = async(req, res) => {
    res.send("God is good!!")
}
module.exports = { 
            saveTicket, 
            unscannedTicket, 
            scannedTicket, 
            scannerTicket,
            eachTicket,
            buyTicket,
            purchase
        }





/****************** Sample Codes From The Past ************/

  // let userId = await User.findById(req.params.id)
        //     res.json(id._id);
        // let username = await User.findById(req.params.firstname)
        //     res.json(firstname.firstname);


/****************** Sample Codes From The Past ************/
          // console.log(userId.firstname)
        // const id = await fetch('http://localhost:3000/auth/634d50d4dc833de4d17f1233')
        //     let userId = await id.json(id)


/***************Here We Go*/

        // let cards = await [].concat(events, ticket)
            // cards = await events.push(...ticket)
            //let cards = await [...ticket, ...events ]