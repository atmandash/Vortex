const mongoose = require('mongoose');

const hospitalPatientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    patientId: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    history: { type: String },
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HospitalPatient', hospitalPatientSchema);
