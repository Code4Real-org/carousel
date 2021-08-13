const { lottery } = require("../models");
const db = require("../models");
const User = db.user;
const UserAssignments = db.user_assignments;
const Lottery = db.lottery;
const Op = db.Sequelize.Op;


// Create and Save a new Lottery
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }


  // Create a Lottery
  const lottery = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  };


  // Save Lottery in the database
  Lottery.create(lottery)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Lottery."
      });
    });
};


// Retrieve all Lotteries from the database.
exports.findAll = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  try {
    user_assignment = await UserAssignments.findOne({where: {userId: uid, assignmentId: assignmentId}});
    lotteries = await user_assignment.getLotteries();
    for (lottery in lotteries) {
      poas = lottery.getPoas();
      lottery.firstName = poas.firstName;
      lottery.middleName = poas.middleName;
      lottery.lastName = poas.lastName;
    }
    res.send(lotteries);
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
exports.deleteAll = (req, res) => {
  Lottery.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Lotteries were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all lotteries."
      });
    });
};