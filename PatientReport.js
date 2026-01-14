const mongoose = require('mongoose');

const patientReportSchema = new mongoose.Schema({
    patientId: { type: String, required: true },
    respRate: { type: Number, required: true },
    sysBp: { type: Number, required: true },
    gcs: { type: Number, required: true },
    qsofaScore: { type: Number, required: true },
    riskStatus: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientReport', patientReportSchema);
