const db = require("../models");
const Assignment = db.assignment;
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
    console.log(err.message || "Some error occurred while getting a POAS.");
  }
};


exports.getCounts = async (userId, assignmentId, poasList) => {
  let user_assignment = await UserAssignments.findOne({where: {userId: userId, assignmentId: assignmentId}});
  let assignment = await Assignment.findByPk(user_assignment.assignmentId);
  let maxEntries = assignment.maxEntries;
  let poasStats = [];

  try {
    for (let poaId of poasList) {
      let counts = [];
      
      for (let i = 1; i <= maxEntries; i++) {
        let result = await Lottery.findAll({
          attributes: [
            [db.sequelize.fn('COUNT', db.sequelize.col('preference')), 'count_per_preference']
          ],
          where: {
            userAssignmentId: user_assignment.id,
            poaId: poaId,
            preference: i
          },
          raw: true
        });

        lotteryCount = result[0].count_per_preference;
        counts.push(lotteryCount);
      }
  
      poasStats.push(counts);
    }
  } catch(err) {
    onsole.log(err.message || "Some error occurred while retrieving POAS stats.");
  }
  
  return poasStats;
}


// Retrieve stats for a given set of POAS entries.
exports.getStats = async (req, res) => {
  try {
    let assignment = req.body.assignment;
    let poasList = req.body.poasList;
    return getCounts(assignment, poasList);
  } catch(err) {
    console.log(err.message || "Some error occurred while retrieving POAS stats.");
  }
};