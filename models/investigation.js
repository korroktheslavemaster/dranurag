
// models/patient.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment');

var investigationSchema = mongoose.Schema({
  patient: {type: Number, ref: 'Patient'},
  name: {
    type: String,
    required: true
  },
  units: {
    type: String,
    required: false
  },
  value: {
    type: String,
    required: true
  }
});


investigationSchema.plugin(autoIncrement.plugin, { model: 'Investigation', startAt: 1000 });


module.exports = mongoose.model('Investigation', investigationSchema);
