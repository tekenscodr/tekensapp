const createError = require('http-errors')
const Ticket = require('../models/qrcode-model')
const QRCode = require('qrcode')
const Event = require('../models/event-model')
const User = require('../models/customer');
const { find } = require('../models/qrcode-model');
const { default: mongoose } = require('mongoose');
const { populate } = require('../models/event-model');
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));





const saveTicket = async(req, res, next) =>{
    try {
        
        /******************** Get All The Data From Endpoints ************************/
        // const user = await fetch('http://localhost:3000/auth/:id')
        //     let userId = await user.json(user)

        const userId = await req.payload  
        const eventId = await fetch('http://localhost:3000/events/:id')
            .then(res => res.json())

        // Save Ticket into database
        const ticket = new Ticket({
            userId: userId,
            eventId: eventId
        });
        ticket.save()
        res.send(ticket.id)
        const code = await QRCode
            .toFile(`./codegenerated/${ticket.id}.png`, `${userId} + ${eventId}`)
            return res.status(200).json(code) 
    } catch (err) {
        res.send(err.message)
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
        
        
        pending = await Promise.all(tickets.map(async (ticket, i) => {
            let events = await Event.find({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
            ticket.event_details = events
            
            return {
                ticket,
                events
             };
            }));
            res.json({
                success: true,
                code:200,
                message:"Ticket found",
                response: pending});
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
            const events = await Event.find({
                _id:mongoose.Types.ObjectId(ticket.eventId)
            }).lean()
             ticket.event_details = events
             //let cards = await ticket.push(...events)
             // cards = await events.push(...ticket)
             
              return {
                ticket,
                events
             };
            }))
            res.status(200).res.json({
                success: true,
                code:200,
                message:"Ticket found",
                response: pending});


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


        // const event = await req.params.id
         const ticket = fetch()
        // const ticket = await Ticket.findOne({_id : id})
        //     res.status(200).json(ticket)
    } catch (error) {
        next(error)
    }
}

module.exports = { 
            saveTicket, 
            unscannedTicket, 
            scannedTicket, 
            scannerTicket,
            eachTicket,
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