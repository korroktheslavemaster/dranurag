var moment = require("moment");

const db = require("monk")(process.env.MONGODB_URI);

const patients = db.get("patients");

patients.find().then(docs => {
  docs.forEach(doc => {
    if (doc.age) {
      doc.inferredBirthdate = moment()
        .subtract(doc.age, "years")
        .toDate();
      patients
        .findOneAndUpdate({ _id: doc._id }, doc)
        .then(elm => console.log(elm));
    }
  });
});
