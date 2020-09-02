var mongoose = require('mongoose');
var LogSchema  = new mongoose.Schema({
    userid:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true
    },
    ipaddress:{
        type: String,
        required: true,
        trim: true
    },
    agent:{
        type: String,
        trim:true,
        required: true,
    },
    description: {
        type: String,
        trim:true,
        required: true,
    },
    macaddress:{
        type: String,
        trim:true,
        required: true,
    },
    type:{
        type: String,
        trim:true,
    },
    browser:{
        type: String,
        trim:true,
    },
    os:{
        type: String,
        trim:true,
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})
var Log = mongoose.model('Logs',LogSchema);
module.exports = Log;