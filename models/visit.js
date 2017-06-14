// models/visit.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var visitSchema = mongoose.Schema({
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
    investigations: [String],
    reviewAfter: String, // use duration?,
    patient: {type: Number, ref: 'Patient', required: true}
});

visitSchema.plugin(autoIncrement.plugin, { model: 'Visit', startAt: 1000 });


module.exports = mongoose.model('Visit', visitSchema);
