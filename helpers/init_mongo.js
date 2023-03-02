const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

mongoose.connect(process.env.DEV_MONGODB_URI, {
// mongoose.connect("mongodb+srv://ensleyb:tekens243@cluster0.rex1f.mongodb.net/test", {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
.then(() => {
    console.log('mongodb tekens connected')
})
.catch((err) => console.log(err.message))

mongoose.connection.on('connected', () => {
    console.log('mongodb connection established')
})

mongoose.connection.on('error', (err) =>{
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('mongoose connection disconnected')
})


process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
})