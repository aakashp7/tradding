var mongoose = require('mongoose');
var settimerSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    time: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// settimerSchema.post("save", function(doc) {
//     console.log("doc", doc);
//     Pusher.TimerAddNotification(doc);
// });

// settimerSchema.post("update", function(doc) {
//     var filter=this._conditions;
//     var field =this._update;
//     console.log("filter", filter); 
//     console.log("field", field);
//     // console.log("this", this);
//     console.log("doc", doc);

//     Pusher.TimerUpdateNotification(filter,field);
// });
var settimer = mongoose.model('settimer', settimerSchema);


module.exports = settimer;