var mongoose = require('mongoose');
const socketModel = require('../others/socket');

var membershipplanSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    time: {
        type: String,
        trim: true
    },
    fullplan: {
        type: String,
        trim: true
    },
    num: {
        type: Number,
        trim: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
    installmentPlan: {
        type: Number,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
membershipplanSchema.post("save", function (doc) {
    if (typeof doc !== 'undefined' && doc && doc !== null) {
        socketModel.PlanUpdateNotification(doc);
    }
});
var membershipplan = mongoose.model('membershipplan', membershipplanSchema);
module.exports = membershipplan;