const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospitalId: { type: String, required: true, unique: true },
    name: { type: String },
    location: { type: String }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
