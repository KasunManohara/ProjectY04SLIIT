const mongoose = require('mongoose');

const GrowShedSchema =  new mongoose.Schema({
    GSCode: {
        type: String,
        required: true
    },
    Condition: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    }
});
const GrowShed = mongoose.model('GrowShed',GrowShedSchema);

module.exports = GrowShed; 