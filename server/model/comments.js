var mongoose = require('mongoose');
var CommentSchema  = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
    },
    content_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true,
    },
    comment: {
        type: String,
        required: true,
    },
    report_status: {
        type: Boolean,
        trim:true,
        default:false
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})
var Comment = mongoose.model('Comments', CommentSchema);
module.exports = Comment;