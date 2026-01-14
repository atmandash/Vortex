const mongoose = require('mongoose');
const AllowedHospital = require('../models/AllowedHospital');
require('dotenv').config(); // Expects to be run from root

const sampleHospitals = [
    { hospitalId: 'HOSP001', name: 'City General' },
    { hospitalId: 'HOSP002', name: 'St. Marys' },
    { hospitalId: 'HOSP003', name: 'Community Care' },
    { hospitalId: 'HOSP004', name: 'Memorial Hospital' },
    { hospitalId: 'HOSP005', name: 'University Medical' },
    { hospitalId: 'HOSP006', name: 'Childrens Hospital' },
    { hospitalId: 'HOSP007', name: 'Veterans Affairs' },
    { hospitalId: 'HOSP008', name: 'Hope Clinic' },
    { hospitalId: 'HOSP009', name: 'Sunrise Health' },
    { hospitalId: 'HOSP010', name: 'Westside Medical' },
    { hospitalId: 'HOSP011', name: 'Northshore General' },
    { hospitalId: 'HOSP012', name: 'East End Clinic' },
    { hospitalId: 'HOSP013', name: 'South City Hospital' },
    { hospitalId: 'HOSP014', name: 'Central Trauma Center' },
    { hospitalId: 'HOSP015', name: 'Mercy Hospital' },
    { hospitalId: 'HOSP016', name: 'General Baptist' },
    { hospitalId: 'HOSP017', name: 'Advanced Care Unit' },
    { hospitalId: 'HOSP018', name: 'Regional Medical' },
    { hospitalId: 'HOSP019', name: 'Specialty Surgery' },
    { hospitalId: 'HOSP020', name: 'Urgent Care Plus' },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await AllowedHospital.deleteMany({});
        console.log('Cleared existing allowed hospitals');

        await AllowedHospital.insertMany(sampleHospitals);
        console.log(`Seeded ${sampleHospitals.length} hospitals`);

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
