const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: String },

}, 
{ timestamps: true }, 
)

const Event = mongoose.model('event', eventSchema)
module.exports = Event