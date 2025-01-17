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
const https = require('https');
const Purchase = require('../models/purchase');
const { verifyPayment, getEvent, createPurchase, createTicket } = require('../lib/utils')
require('dotenv')

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));
   
    

// const bucketName = process.env.CODE_BUCKET_NAME
// const region= process.env.CODE_BUCKET_REGION
// const accessKey = process.env.CODE_ACCESS_KEY
// const secretAccessKey = process.env.CODE_SECRET_KEY
// const s3 = new S3Client({
//         credentials: {
//             accessKeyId: accessKey,
//             secretAccessKey: secretAccessKey,
//         },
//         region: region
//     });
    
// CREATE CODE FOR EACH TICKET
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// PURCHASED TICKET FOR SELF USING WEB OR APP
const purchaseWebApp = async (req, res, next) => {
  try {
    console.log('Purchasiung')
      const userId = req.payload;
      const eventId = req.params.eventId;
      const referenceId = req.params.referenceId;

      // Verify payment
      const paymentVerificationResult = await verifyPayment(referenceId);
      if (!paymentVerificationResult) {
          return res.status(500).json({ message: 'Payment not verified' });
      }

      // Get event
      const event = await getEvent(eventId);
      if (!event) {
          return res.status(500).json({ message: 'Event not found' });
      }

      // Create ticket
      const ticket = await createTicket(req.body, userId, eventId);
      if (!ticket) {
          return res.status(500).json({ message: 'Ticket not created' });
      }

      // Create purchase
      const purchase = await createPurchase(ticket._id, userId, referenceId, req.body);
      if (!purchase) {
          return res.status(500).json({ message: 'Purchase not created' });
      }

      // Return event and ticket
      const eventTicket = { ...event._doc, ...ticket._doc };
      return res.status(201).json(eventTicket);
  } catch (err) {
      next(err);
      return res.status(500).json({ message: `Error: ${err.message}` });
  }
};



// PURCHASE TICKET FOR ANOTHER
const purchaseForAnother = async(req, res, next) =>{
    try {
        const buyerId = await req.payload
        const eventId = await req.params.id
        const refernceId = await req.params.refernceId
        const userDetails = await req.body
        const checkUserExist = await User.findOne({phoneNumber: userDetails.phoneNumber})
        if(!checkUserExist){
            // Create and Save user
            const customer = new User(userDetails);
            const savedUser = await customer.save();
            const totalQuantityBought = req.body.ticketVariations.reduce(
                (total, variation) => total + parseInt(variation.quantity, 10), 0);
            // Save Ticket into database
            const ticket = new Ticket({
                userId: savedUser._id,
                eventId: eventId,
                ticketVariations: req.body.ticketVariations,
                initialPurchase: totalQuantityBought,
            });
             // Save to purchase after ticket is created

            const purchase = new Purchase({
                ticketId:ticket._id,
                buyerId: buyerId,
                buyeeId: savedUser._id,
                referenceId: refernceId //Replace this id from payment platform eg Paystack
            })
            
            
            const imageName = randomImageName();
            const code = await QRCode.toString(`${userId} + ${eventId} + ${Date.now}`, (err, data) =>{ 
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
    
            ticket.qrcode = imageName
    
            ticket.save();
            purchase.save()
            res.status(200).json(ticket)
         }else{
            const totalQuantityBought = req.body.ticketVariations.reduce(
                (total, variation) => total + parseInt(variation.quantity, 10), 0);
            // Save Ticket into database
            const ticket = new Ticket({
                userId: checkUserExist._id,
                eventId: eventId,
                ticketVariations: req.body.ticketVariations,
                initialPurchase: totalQuantityBought,
            });
             // Save to purchase after ticket is created
            const purchase = new Purchase({
                ticketId:ticket._id,
                buyerId: buyerId,
                buyeeId: checkUserExist._id,
                referenceId: refernceId //Replace this id from payment platform eg Paystack
            })
        
            const imageName = randomImageName();
            const code = await QRCode.toString(`${userId} + ${eventId} + ${Date.now}`, (err, data) =>{ 
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
    
            ticket.qrcode = imageName
    
            await ticket.save()
            await purchase.save()
            res.status(200).json(ticket)
         }
    } catch (err) {
        res.json(err.message)
        next(err)
    }
}
// TICKET TRANSFER
const transferTicket = async (req, res, next) => {
    try {
        const userEmail = req.body.userId;
        const ticketId = '656a2a3c6a9a6b04e7e16beb'; // Replace with the actual ticket _id
        const eventId = req.body.eventId; //Could derrived from ticketId
        const totalQuantityBought = req.body.ticketVariations.reduce(
            (total, variation) => total + parseInt(variation.quantity, 10), 0);

        // Retrieve existing ticket for the user
        const existingTicket = await Ticket.findById(ticketId);

        if (existingTicket) {
            // Deduct quantities based on the request body data
            req.body.ticketVariations.forEach((deductionVariation) => {
                const existingVariation = existingTicket.ticketVariations.find(
                    (v) => v.name === deductionVariation.name
                );
                console.log(deductionVariation.quantity);
                if (existingVariation) {
                    // Deduct the quantity from the existing variation in the database
                    existingVariation.quantity = Math.max(0, existingVariation.quantity - parseInt(deductionVariation.quantity, 10));
                }
            });

            // Save the updated existing ticket
            transferTicket = await totalQuantityBought;
            existingTicket.transferedTicket = await transferTicket;
            await existingTicket.save();

            // Create a new ticket with the deducted quantities
            const newTicketData = {
                userId: userEmail,
                eventId: eventId,
                ticketVariations: req.body.ticketVariations.map((deductionVariation) => ({
                    name: deductionVariation.name,
                    quantity: deductionVariation.quantity
                })),
                initialPurchase: totalQuantityBought,
            };
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
    
            newTicketData.qrcode = imageName
    

            const newTicket = new Ticket(newTicketData);
            await newTicket.save();

            res.status(200).json({ message: 'Ticket updated successfully.' });
        } else {
            res.status(404).json({ error: 'Ticket not found.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        next(err);
    }
};

/** GET ONE TICKET */
const eachTicket = async(req, res, next)=> {
    try {
        const ticketId = await req.params.id
        //  const ticket = fetch()
        const ticket = await Ticket.findOne({_id : ticketId})
            res.status(200).json(ticket)
    } catch (error) {
        next(error)
    }
}

/****GET PENDING TICKETS BOUGHT BY A PARTICULAR USER********/
const unscannedTicket = async(req, res, next) =>{
    try {    
        let userId = await req.payload;  
        let tickets = await Ticket.find({userId:userId}).where({"isScanned": false});
        /** if condition*/
        if(tickets == 0) res.status(200).json({"data":[]});
        
        
       const pending = await Promise.all(tickets.map(async (ticket) => {
            let event = await Event.findOne({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
            ticket.event_details = event
            return {
                ticketId: ticket._doc._id,
                ...ticket._doc,
                ...ticket.event_details
             };
            }));
            console.log(`GOT ALL PENDING TICKETS BY USER ${userId}`)
            return res.status(200).json(pending);
    } catch (error) {
        res.status(500).json(error);
        next(error)
    }
}
// Scan Ticket
const scanTicket = async (req, res, next) => {
    //TODO check for how to update using mongoose
    try {
      const ticketId = await req.params.ticketId;
      const ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: { isScanned: true } },
        { new: true }
      );
      if (!ticket) {
        throw new Error(`Ticket not found with ID ${ticketId}`);
      }
      const event = await Event.findOne({ _id: ticket.eventId }).lean();
      ticket.event_details = event;
      console.log(`GOT ALL CANCELED TICKETS BY USER ${req.payload}`)
      res.status(200).json({ticketId:ticket._doc._id, ...ticket._doc, ...event });
    } catch (error) {
      next(error);
      res.status(500).json({ msg: error, status: "Failed" });
    }
  };
/*******All Tickets Bought By A Particular User That Are Scanned*****/
const attended = async(req, res, next) =>{
    try {      
        let userId = await req.payload;  
        let tickets = await Ticket.find({ userId: userId, isScanned: true }); 
       const scanned = await Promise.all(tickets.map(async (ticket) => {
            let event = await Event.findOne({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
            ticket.event_details = event
            return {
                ticketId: ticket._doc._id,
                ...ticket._doc,
                ...event
             };
            }));
            console.log(`GOT ALL ATTENDED TICKETS BY USER ${userId}`)
            return res.status(200).json(scanned);
    } catch (error) {
        res.status(500).json(error);
        next(error)
    }
}
// Cancel Tickets 
const cancelTicket = async (req, res, next) => {
    //TODO check for how to update using mongoose
    try {
      const ticketId = await req.params.ticketId;
      const ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId },
        { $set: { isCanceled: true } },
        { new: true }
      );
      if (!ticket) {
        throw new Error(`Ticket not found with ID ${ticketId}`);
      }
      const event = await Event.findOne({ _id: ticket.eventId }).lean();
      ticket.event_details = event;
      console.log(`GOT ALL CANCELED TICKETS BY USER ${req.payload}`)
      res.status(200).json({ticketId:ticket._doc._id, ...ticket._doc, ...event });
    } catch (error) {
      next(error);
      res.status(500).json({ msg: error, status: "Failed" });
    }
  };
/*******All Tickets Canceled By A Particular User*****/
const canceledTicket = async(req, res, next) =>{
    try {
        let userId = await req.payload;  
        let tickets = await Ticket.find({userId:userId}).where({"isCanceled": true});        
        
       const canceled = await Promise.all(tickets.map(async (ticket) => {
            let event = await Event.findOne({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
            ticket.event_details = event
            
            return {
                ticketId: ticket._doc._id,
                ...ticket._doc,
                ...event
             };
            }));
            console.log(`GOT ALL CANCELED TICKETS BY USER ${userId}`)
            return res.status(200).json(canceled);
    } catch (error) {
        res.status(500).json(error);
        next(error)
    }
}

// Get All Scanned Ticket
const scannedTicket = async(req, res, next) =>{
    try {
        const eventId = await fetch
        ('http://localhost:3000/ticket/:id').then(res => res.json())
        
        const ticket = await Ticket.find({eventId:eventId}).where({"isScanned": true})
          res.status(200).json({ticket})
    } catch (error) {
        next(error)
    }
}

// PURCHASE DONE USING USSD
const ussdPurchase = async(req, res, next) => {
    try {
        let userId = await req.payload
        const result = await User.findOne({_id: userId})
        let email = result.email
        const params = await JSON.stringify({
            "email": email,
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
              let result = JSON.parse(data);
              if(result.status == true) res.redirect(result.data.authorization_url);
              next();
              console.log(result)
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




module.exports = { 
            purchaseWebApp, 
            unscannedTicket, 
            attended, 
            scannedTicket,
            eachTicket,
            ussdPurchase,
            transferTicket,
            scanTicket,
            cancelTicket,
            purchaseForAnother,
            canceledTicket
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