// models/patient.js
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var patientSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    dateOfBirth: Date,
    sex: String,
    phone1: String,
    phone2: String,
    visits: [{type: Number, ref: 'Visit'}]
});

patientSchema.plugin(autoIncrement.plugin, { model: 'Patient', startAt: 1000 });


module.exports = mongoose.model('Patient', patientSchema);
