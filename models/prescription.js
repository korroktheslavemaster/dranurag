// models/prescription.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var prescriptionSchema = mongoose.Schema({
    patient: {type: Number, ref: 'Patient', required: true}
    date: Date,
    diagnosis: String,
    chiefComplaints: [{
      complaint: String,
      duration: String // use duration?
    }],
    onExamination: {
      pulse: String,
      bp: String,
      temp: String,
      notes: String,
    },
    treatmentAdvised: {
      dietary: String,
      medicines: String,
      other: String,
    }
    reviewAfter: String, // use duration?,
    
});

prescriptionSchema.plugin(autoIncrement.plugin, { model: 'Prescription', startAt: 1000 });


module.exports = mongoose.model('Prescription', prescriptionSchema);
