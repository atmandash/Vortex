const mongoose = require('mongoose');

const allowedHospitalSchema = new mongoose.Schema({
    hospitalId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        default: 'General Hospital'
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AllowedHospital', allowedHospitalSchema);
