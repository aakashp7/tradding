var mongoose = require('mongoose');
var OtpSchema  = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true
    },
    code:{
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Number,
        trim:true,
        required: true,
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})
var Otp = mongoose.model('Otp',OtpSchema);
module.exports = Otp;