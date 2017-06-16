// models/patient.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var moment = require('moment');

var patientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  sex: String,
  phone1: String,
  phone2: String,
  height: Number,
  weight: Number,
  bmi   : Number,
  allergies: String,
});

patientSchema.methods.getHelpText = function() {
  helpText = this.sex
  if (this.dateOfBirth) {
    helpText += ", " + moment(new Date()).diff(this.dateOfBirth, 'years') + " yrs"
  }
  if (this.phone1) {
    helpText += ", " + this.phone1
  }
  return helpText
}

patientSchema.plugin(autoIncrement.plugin, { model: 'Patient', startAt: 1000 });


module.exports = mongoose.model('Patient', patientSchema);
