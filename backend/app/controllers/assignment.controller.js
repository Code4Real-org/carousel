const db = require("../models");
const Assignment = db.assignment;
const Op = db.Sequelize.Op;


// Create and Save a new Assignment
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }


  // Create a Assignment
  const assignment = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  };


  // Save Assignment in the database
  Assignment.create(assignment)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Assignment."
      });
    });
};


// Find a single Assignment with an id
exports.findOne = (req, res) => {
  const id = parseInt(req.params.id);

  Assignment.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Assignment with id=" + id
      });
    });
};


// Update a Assignment by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Assignment.update(req.body, {
    where: { assignmentId: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Assignment was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Assignment with id=" + id
      });
    });
};


// Delete a Assignment with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Assignment.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Assignment was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Assignment with id=" + id
      });
    });
};


// Delete all Assignments from the database.
exports.deleteAll = (req, res) => {
  Assignment.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Assignments were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Assignments."
      });
    });
};