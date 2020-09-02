var mongoose = require('mongoose');
var categorySchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.ObjectId,
        trim: true
    },
    category_name: {
        type: String,
        trim: true,
    },
    subcategory_name: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
var category = mongoose.model('category', categorySchema);
module.exports = category;