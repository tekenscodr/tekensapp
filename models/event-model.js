const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Scanners = require('./scanner')
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

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: {type: String},
    banner: { type: String },
    category: { type: Array },
    variation: [
        { 
            name : {type: String},
            price : {type: String},
            capacity: {type: Number},
            description: {type: String}, 
        },
    ],
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: String },
    isOnline: {default:false},
    location: GeoSchema,
    isActive: {default:false},
 
}, 
{ timestamps: true }, 
);



// const location = mongoose.model('goeschema', GeoSchema)
const Event = mongoose.model('event', eventSchema)

module.exports = Event
