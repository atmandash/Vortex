const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Required now as per user request
    patientId: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for hospital reg
    age: { type: Number },
    gender: { type: String },
    history: { type: String } // Medical History Dropdown Value
});

module.exports = mongoose.model('Patient', patientSchema);
