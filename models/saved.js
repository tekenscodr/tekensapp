const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const savedSchema = new Schema({
    eventId: {
        type: String, 
        required: true
    },
    userId: {
        type: String, 
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
},
{timestamps:true},
)

const Saved = mongoose.model('saved', savedSchema);
module.exports = Saved