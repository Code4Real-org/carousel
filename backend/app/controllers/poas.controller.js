const db = require("../models");
const User = db.user;
const UserAssignments = db.user_assignments;
const Lottery = db.lottery;
const Poas = db.poas;


// Create and Save a new POAS entry
exports.create = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  const entry = req.body;

  // Save the entry in the database
  try {
    user_assignment = await UserAssignments.findOne({where: {userId: uid, assignmentId: assignmentId}});

    let poas = await this.findOrCreate(entry.firstName, entry.middleName, entry.lastName);
    return poas;
  } catch(err) {
    console.log(err.message || "Some error occurred while creating the POAS.");
  }
};


// Retrieve or create a new POAS entry in the database.
exports.findOrCreate = async (first, middle, last) => {
  try {
    let poas = await Poas.findOne({where: {firstName: first, middleName: middle, lastName: last}});
    if (poas == null) {
      poas = await Poas.create({firstName: first, middleName: middle, lastName: last, count: 0});
    }
    return(poas);
  } catch(err) {
    console.log(err.message || "Some error occurred while retrieving Assignments.");
  }
};