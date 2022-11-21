const createError = require('http-errors')
const Ticket = require('../models/qrcode-model')
const QRCode = require('qrcode')
const fetch = (...args) =>
    import ('node-fetch').then(({ default: fetch }) => fetch(...args));

const saveTicket = async(req, res, next) =>{
    try {
        
        /******************** Get All The Data From Endpoints ************************/
        const user = await fetch('http://localhost:3000/auth/634d50d4dc833de4d17f1233')
            let userId = await user.json(user)
        const eventId = await fetch('http://localhost:3000/events/634ea51fcab14c16c37ba615')
            .then(res => res.json())

        // Save Ticket into database
        const ticket = new Ticket({
            username: userId.firstname,
            userId: userId._id,
            eventId: eventId
        });
        ticket.save()
        res.send(ticket.id)
        const code = await QRCode
            .toFile(`./codegenerated/${ticket.id}.png`, `${userId.id} + ${eventId}`)
        res.send(code)

        return
    } catch (err) {
        res.send(err.message)
        next(err)
    }
}

// const getCode = async(req, res, next) => {
//     try {
//         const id = await Ticket.findById(req.params.id)
//         res.json(id._id);
//         const code = await QRCode
//             .toFile(`./codegenerated/${id._id}.png`, `${id.userId} + ${id.eventId}`)
//         res.send(code)


//     } catch (err) {
//         res.send('Error: ' + err.message)
//         next(err)
//     }
// }

module.exports = { saveTicket }





/****************** Sample Codes From The Past ************/

  // let userId = await User.findById(req.params.id)
        //     res.json(id._id);
        // let username = await User.findById(req.params.firstname)
        //     res.json(firstname.firstname);


/****************** Sample Codes From The Past ************/
          // console.log(userId.firstname)
        // const id = await fetch('http://localhost:3000/auth/634d50d4dc833de4d17f1233')
        //     let userId = await id.json(id)