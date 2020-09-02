var mongoose = require('mongoose');
var GroupSchema  = new mongoose.Schema({
    group: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    type:{
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        trim: true
    },
    permission:{
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim:true,
        required: true,
        default: '1'
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})
var Groups = mongoose.model('Groups',GroupSchema);
module.exports = Groups;
