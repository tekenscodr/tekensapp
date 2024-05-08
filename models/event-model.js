const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
    location: {
        type: {
            default: "Point",
            type: String
        }, 
        coordinate: {
            type: [Number],
            index: "2dsphere"
        },
    }

    
})
const scannersSchema = new Schema({
    scanners: {
    mobile: {type: String, required: true},
    otp: {type: String,  required: true},
}

})

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String },
    category: { type: Array },
    variation: [
        { 
            name : {type: String},
            price : {type: String}, 
        },
    ],
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: String },
    location: GeoSchema,
    scanners: [scannersSchema],
}, 
{ timestamps: true }, 
);



// const location = mongoose.model('goeschema', GeoSchema)
const Event = mongoose.model('event', eventSchema)
const Scanners = mongoose.model('scanner', scannersSchema)

module.exports = Event
module.exports = Scanners