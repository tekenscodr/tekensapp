const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const Customer = require('./models/customer')
require('dotenv').config()
require('./helpers/init_mongo')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const { getEvents } = require('./controllers/events')
require('./helpers/init_redis')
const AuthRoute = require('./routes/auth')
const Events = require('./routes/events')
const Qrcode = require('./routes/qrcode')
const cookieParser = require('cookie-parser')
const cors = require('cors');



const app = express()
app.disable('etag')

//middleware
app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads/', express.static('uploads'))

// const corsOption = {
//     origin: ['https://tekensapp.vercel.app/'],
// };
//  app.use(cors(corsOption));
//if you want in every domain then
app.use(cors())

//Routes from server
app.get('/', (req, res)=>{
    res.send("You are in the server");
})
// app.get('/getuser', verifyAccessToken, async (req, res, next)=>{
//           try {
//             let id = await req.payload;
//             let user = await Customer.findOne({_id:id}).exec()
//             console.log(user)  
//             return res.json({...user._doc});
//         }catch(err) {
//             next(err)
//         }

// })
app.use('/auth', AuthRoute)
app.use('/events', Events)
app.use('/ticket', Qrcode)

app.use(async(req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

const PORT =  6000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

module.exports = app