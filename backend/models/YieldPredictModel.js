const mongoose = require('mongoose');

const GrowComponentSchema = new mongoose.Schema({
    Noofpots: {
        type: Number,
        required: true
    },
    TempInside: {
        type: Number,
        required: true
    },
    HumidInside: {
        type: Number,
        required: true
    },
    CO2Inside: {
        type: Number,
        required: true
    },
    TempOutside: {
        type: Number,
        required: true
    },
    HumidOutside: {
        type: Number,
        required: true
    },
    CO2Outside: {
        type: Number,
        required: true
    },
    Yield: {
        type: Number,
        required: true
    }
});

const GrowComponent = mongoose.model('GrowComponent', GrowComponentSchema);

module.exports = GrowComponent;
