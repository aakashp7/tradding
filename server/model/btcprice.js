var mongoose = require('mongoose');
var btcpriceSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    amount: {
        type: Number,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
var btcprice = mongoose.model('btcprice', btcpriceSchema);
module.exports = btcprice;