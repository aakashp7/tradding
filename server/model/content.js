var mongoose = require('mongoose');
const socketModel = require('../others/socket');

var contentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true
    },
    contenttype: {
        type: String,
        trim: true
    },
    content_url: {
        type: String,
        trim: true
    },
    article: {
        type: String,
        trim: true
    },
    video_privacy: {
        type: String,
        trim: true
    },
    audio_privacy: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        trim: true
    },
    video_title: {
        type: String,
        trim: true
    },
    video_thumbnail: {
        type: String,
        trim: true
    },
    video_thumbnail_id: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    audio_title: {
        type: String,
        trim: true
    },
    audio_thumbnail: {
        type: String,
        trim: true
    },
    audio_thumbnail_id: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    article_title: {
        type: String,
        trim: true
    },
    article_thumbnail: {
        type: String,
        trim: true
    },
    image_title: {
        type: String,
        trim: true
    },
    category: {
        type: Array,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

contentSchema.post("findOneAndUpdate", function (doc) {
    var userid = doc._id;
    socketModel.UpdateContent(doc);
});

contentSchema.post("save", function (doc) {
    if (typeof doc !== 'undefined' && doc && doc !== null) {
        socketModel.UpdateContent(doc);
    }
});

contentSchema.post("update", function (doc) {
    var result = doc.result;
    if (typeof doc !== 'undefined' && doc && doc !== null && Number(result.nModified) > 0) {
        socketModel.UpdateContent(doc);
    }
});

contentSchema.post("updateOne", function (doc) {
    var filter = this._conditions;
    var field = this._update;
    socketModel.UpdateContent(doc);
});

contentSchema.post("deleteOne", function (doc) {
    var filter = this._conditions;
    var field = this._update;
    socketModel.UpdateContent(doc);
});


var content = mongoose.model('content', contentSchema);
module.exports = content;