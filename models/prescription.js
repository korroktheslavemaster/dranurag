// models/prescription.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var medicineAdviceSchema = mongoose.Schema({
    drug: String,
    dosage: String,
    frequency: String,
    duration: String,
    specialAdvice: String
})

var prescriptionSchema = mongoose.Schema({
    patient: {type: Number, ref: 'Patient', required: true},
    date: Date,
    diagnosis: String,
    chiefComplaints: String,
    onExaminationPulse: String,
    onExaminationBp: String,
    onExaminationTemp: String,
    onExaminationNotes: String,
    investigationsRequired: [String],
    medicineAdvice: [medicineAdviceSchema],
    dietaryAdvice: String,
    otherAdvice: String,
    reviewAfterNumber: Number, // use duration?,
    reviewAfterType: String
});

prescriptionSchema.plugin(autoIncrement.plugin, { model: 'Prescription', startAt: 1000 });


module.exports = mongoose.model('Prescription', prescriptionSchema);
