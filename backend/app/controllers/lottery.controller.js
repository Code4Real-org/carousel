const db = require("../models");
const User = db.user;
const UserAssignments = db.user_assignments;
const Lottery = db.lottery;
const Poas = db.poas;
const poasController = require("../controllers/poas.controller");


// Create and Save a new Lottery
exports.create = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  // Create a Lottery
  const lotteries = req.body;

  // Save Lottery in the database
  try {
    user_assignment = await UserAssignments.findOne({where: {studentId: uid, assignmentId: assignmentId}});
    let old_lotteries = await user_assignment.getLotteries();
    for (entry of old_lotteries) {
      let poas = await poasController.findOrCreate(entry.firstName, entry.middleName, entry.lastName);
      await poas.decrement('count', {by: 1});
      await entry.destroy({ force: true });
    };

    for (entry of lotteries) {
      let lottery = await Lottery.create(entry);
      let poas = await poasController.findOrCreate(entry.firstName, entry.middleName, entry.lastName);
      await poas.addLottery(lottery.id);
      await poas.increment('count', {by: 1});
      await user_assignment.addLottery(lottery.id);
    };
    res.status(200).send({message: "Done!"});
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Lottery."
    });
  }
};


// Retrieve all Lotteries from the database.
exports.findAll = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  try {
    let user_assignment = await UserAssignments.findOne({where: {studentId: uid, assignmentId: assignmentId}});
    let lotteries = await user_assignment.getLotteries();
    let poasList = [];

    for (lottery of lotteries) {
      let poas = await Poas.findByPk(lottery.poaId);  // have to use the odd name
      poasList.push(poas.id);
      lottery.firstName = poas.firstName;
      lottery.middleName = poas.middleName;
      lottery.lastName = poas.lastName;
    }

    let poasStats = await poasController.getCounts(uid, assignmentId, poasList);
    res.send({lotteries: lotteries, poasStats: poasStats});
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Assignments."
    });
  }
};


// Find a single Lottery with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Lottery.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Lottery with id=" + id
      });
    });
};


// Update a Lottery by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Lottery.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lottery was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Lottery with id=${id}. Maybe Lottery was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Lottery with id=" + id
      });
    });
};


// Delete a Lottery with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Lottery.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Lottery was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Lottery with id=${id}. Maybe Lottery was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Lottery with id=" + id
      });
    });
};


// Delete all Lotteries from the database.
exports.deleteAll = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  // Remove all Lottery in the database from the user for a certain assignment
  try {
    user_assignment = await UserAssignments.findOne({where: {userId: uid, assignmentId: assignmentId}});
    let lotteries = await user_assignment.getLotteries();
    lotteries.forEach((entry, index) => {
      entry.destroy();
    });

    res.send({ message: `${nums} Lotteries were deleted successfully!` });
  } catch(err) {
    res.status(500).send({
      message: err.message || "Some error occurred while removing all lotteries."
    });
  };
};