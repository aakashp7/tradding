var mongoose = require('mongoose');
var invoiceSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    memo: {
        type: String,
        trim: true
    },
    invoiceId: {
        type: String,
        trim: true
    },
    URI: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: "Pending"
    },
    request_url: {
        type: String,
        trim: true
    },
    index_url: {
        type: String,
        trim: true
    },
    btcamount: {
        type: Number,
        trim: true
    },
    newsletter: {
        type: String,
        trim: true,
    },
    payment_date: {
        type:Date,
        trim:true,
    },
    expiry_date: {
        type:Date,
        trim:true,
    },
    req_Obj: {
        type: Object,
        required: true
    },
    isInstallmentPlan: {
        type: Boolean,
        trim: true
    },
    installmentPlan: {
        type: Number,
        trim: true
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }
})
var invoice = mongoose.model('invoice', invoiceSchema);
module.exports = invoice;