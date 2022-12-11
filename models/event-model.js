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

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    banner: { type: String, required: true },
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
    isSaved: {type: Boolean, default: false},
    location: GeoSchema,
}, 
{ timestamps: true }, 
);



// const location = mongoose.model('goeschema', GeoSchema)
const Event = mongoose.model('event', eventSchema)
module.exports = Event