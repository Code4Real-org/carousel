const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Assignment = db.assignments;
const UserAssignments = db.user_assignments;
const poasController = require("../controllers/poas.controller");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Retrieve all Assignments from the database.
exports.findAllAssignments = (req, res) => {
  const uid = req.userId;

  User.findByPk(uid)
    .then(user => {
      user.getAssignments().then(data => {
        res.send(data);
      })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Assignments."
      });
    });
};


// Find a single Assignment with an id
exports.findOneAssignment = (req, res) => {
  const id = req.params.id;

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


exports.doLottery = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  try {
    let user_assignment = await UserAssignments.findOne({where: {userId: uid, assignmentId: assignmentId}});
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
        err.message || "Some error occurred while conducting lottery."
    });
  }
};

exports.showLottery = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  try {
    let user_assignment = await UserAssignments.findOne({where: {userId: uid, assignmentId: assignmentId}});
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
        err.message || "Some error occurred while retrieving lottery result."
    });
  }
};


exports.signup = (req, res) => {
  // Save User to Database
  User.findOrCreate({
    where: {
      email: req.body.email
    }
  })
    .then(result => {
      user = result[0];
      Role.findOne({
        where: {
          name: "teacher"
        }
      }). then(role => {
        user.addRoles(role).then(() => {
          res.send({ message: "Teacher was registered successfully!" });
        });
      })
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.hasRoles(2)) {
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          accessToken: token
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};