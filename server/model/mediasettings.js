var mongoose = require('mongoose');
var MediaControlsSchema  = new mongoose.Schema({
    profile_picture: {
        type: Number,
        required: true,
        default: 300000  // 300KB
    },
    album_cover: {
        type: Number,
        required: true,
        default: 500000  // 500KB
    },
    thumbnail: {
        type: Number,
        required: true,
        default: 500000  // 500KB
    },
    audio_duration: {
        type: Number,
        required: true,
        default: 1200 // 8:20 minutes
    },
    video_duration:{
        type: Number,
        required: true,
        default: 9000 // 8:20 minutes
    },
    video_size:{
        type: Number,
        required: true,
        default: 500000000  // 500MB
    },
    audio_size:{
        type: Number,
        required: true,
        default: 10000000  // 10MB
    },
    updatedAt: {
        type : Date
    },
    createdAt: {
        type : Date,
        default : Date.now
    }
})
var MediaControls = mongoose.model('MediaControls', MediaControlsSchema);
module.exports = MediaControls;