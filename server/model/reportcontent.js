var mongoose = require('mongoose');
var ReportSchema  = new mongoose.Schema({
    reporter_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
    },
    content_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
    },
    comment_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
    },
    subject: {
        type: String,
        trim:true,
    },
    description: {
        type: String,
        trim:true,
        required: true,
    },
    status: {
        type: String,
        trim:true,
        required: true,
        default: 'pending'
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})

var ContentReports = mongoose.model('ContentReports',ReportSchema);
module.exports = ContentReports;