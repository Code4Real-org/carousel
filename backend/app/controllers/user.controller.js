const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.gid) {
    res.status(400).send({
      message: "User can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const user = {
    gid: req.body.gid,
    fname: req.body.fname,
    lname: req.body.lname
  };


  // Save Tutorial in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
  };