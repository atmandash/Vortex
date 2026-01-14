const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to allow inline scripts
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS Configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
};
app.use(cors(corsOptions));

// Body Parser
app.use(express.json());

// Compression
app.use(compression());

// Serve static files with caching
app.use(express.static('.', {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true
}));

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const readingSchema = require('./models/Reading');

// Save a new reading
app.post('/api/readings', async (req, res) => {
    try {
        const newReading = new readingSchema(req.body);
        const savedReading = await newReading.save();
        res.status(201).json(savedReading);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get readings for a specific patient (or all if no ID provided - simplified for hackathon)
app.get('/api/readings/:patientId', async (req, res) => {
    try {
        const readings = await readingSchema.find({ patientId: req.params.patientId }).sort({ timestamp: -1 });
        res.json(readings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Event Registration Route
const EventRegistration = require('./models/EventRegistration');

app.post('/api/register-event', async (req, res) => {
    try {
        const newRegistration = new EventRegistration(req.body);
        const savedRegistration = await newRegistration.save();
        res.status(201).json(savedRegistration);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Personal User Authentication Routes
const Patient = require('./models/Patient');

// Register New Patient
app.post('/api/personal/register', async (req, res) => {
    try {
        const { fullName, phoneNumber } = req.body;

        // Check duplicate
        const existing = await Patient.findOne({ phoneNumber });
        if (existing) {
            return res.status(400).json({ message: "Phone number already registered." });
        }

        // Generate Credentials
        const patientId = "PAT-" + Math.floor(10000 + Math.random() * 90000);
        // Use provided password or generate one
        const finalPassword = req.body.password || Math.random().toString(36).slice(-8);

        const newPatient = new Patient({
            fullName,
            phoneNumber,
            patientId,
            password: finalPassword
        });

        await newPatient.save();

        res.status(201).json({
            message: "Registration successful",
            patientId,
            password: finalPassword
        });
    } catch (err) {
        console.error("Personal Registration Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Patient Login
app.post('/api/personal/login', async (req, res) => {
    try {
        const { patientId, password } = req.body;

        const patient = await Patient.findOne({ patientId, password });
        if (!patient) {
            return res.status(400).json({ message: "Invalid Patient ID or Password" });
        }

        res.json({
            message: "Login successful",
            user: { id: patient.patientId, name: patient.fullName, role: 'patient' }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// New Models
const PatientReport = require('./models/PatientReport');
const Hospital = require('./models/Hospital');
const HospitalReport = require('./models/HospitalReport');
const HospitalPatient = require('./models/HospitalPatient');

// --- PATIENT ROUTES ---
// Save Patient Personal Report
app.post('/api/patient/report', async (req, res) => {
    try {
        const newReport = new PatientReport(req.body); // Expects { patientId, respRate, sysBp, gcs, qsofaScore, riskStatus }
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get Patient History
app.get('/api/patient/history/:patientId', async (req, res) => {
    try {
        const history = await PatientReport.find({ patientId: req.params.patientId }).sort({ timestamp: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- HOSPITAL ROUTES ---
const AllowedHospital = require('./models/AllowedHospital');

// Hospital Login (Simple check, can be expanded to full auth)
app.post('/api/hospital/login', async (req, res) => {
    try {
        const { hospitalId } = req.body;

        if (!hospitalId) return res.status(400).json({ message: "Hospital ID required" });

        const hospital = await AllowedHospital.findOne({ hospitalId });
        if (!hospital) {
            return res.status(401).json({ message: "Invalid Hospital ID. Access Denied." });
        }

        res.json({ message: "Login successful", hospitalId, name: hospital.name });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Save Hospital Screening Report
app.post('/api/hospital/report', async (req, res) => {
    try {
        const newReport = new HospitalReport(req.body); // Expects { hospitalId, wardNumber, bedNumber, vitals... }
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Hospital: Find Existing Patient
app.post('/api/hospital/patient/check', async (req, res) => {
    try {
        const { patientId } = req.body;
        const patient = await HospitalPatient.findOne({ patientId });
        if (!patient) {
            return res.status(404).json({ message: "Patient not found. Please register as new." });
        }
        res.json({ message: "Patient found", patient });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hospital: Register New Patient
app.post('/api/hospital/patient/register', async (req, res) => {
    console.log("Registration attempt:", req.body);
    try {
        const { fullName, age, gender, history, phoneNumber } = req.body;

        if (!fullName || !age || !gender || !phoneNumber) {
            return res.status(400).json({ message: "Missing required fields (Name, Age, Gender, or Contact Number)." });
        }

        // Check for duplicate phone number
        const existing = await HospitalPatient.findOne({ phoneNumber });
        if (existing) {
            return res.status(400).json({ message: "Phone number already registered. Please use 'Existing Patient' login." });
        }

        // Generate ID
        const patientId = "PAT-" + Math.floor(10000 + Math.random() * 90000);

        const newPatient = new HospitalPatient({
            fullName,
            phoneNumber,
            age: Number(age),
            gender,
            history,
            patientId
        });

        await newPatient.save();
        res.status(201).json({ message: "Registered", patientId, patient: newPatient });
    } catch (err) {
        console.error("Registration DB Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- 404 Handler ---
app.use((req, res) => {
    const errorPage = path.resolve(__dirname, '404.html');
    res.status(404).sendFile(errorPage, (err) => {
        if (err) {
            res.status(404).send('404 Page Not Found');
        }
    });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        message: status === 500 ? 'Internal Server Error' : err.message,
        error: process.env.NODE_ENV === 'production' ? {} : err
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
