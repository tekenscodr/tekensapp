const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
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

//middleware
// app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uplaods', express.static('uploads'))

// const corsOption = {
//     origin: ['http://localhost:3000'],
// };
// app.use(cors(corsOption));
//if you want in every domain then
app.use(cors())

//Routes from server
app.get('/', (req, res)=>{
    res.send("You are in the server");
})
// app.get('/events', getEvents)
// app.use('/auth', AuthRoute)
// app.use('/events', Events)
// app.use('/ticket', verifyAccessToken, Qrcode)


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

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

module.exports = app