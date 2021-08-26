const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const UserAssignments = db.user_assignments;
const Poas = db.poas;
const poasController = require("../controllers/poas.controller");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { poas } = require("../models");

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
    let assignment = await Assignment.findByPk(assignmentId);
    let students = await assignment.getUsers();
    for (index = 0; index < students.length; index++) {
      let student = students[index];
      let isTeacher = await student.hasRole(2);
      if (isTeacher) {
        console.log("Removing user: ", student.id, " at ", index, " from the list");
        students.splice(index, 1);
      }
    }
    console.log("Student list: ");
    students.forEach(student => {
      console.log(student.id);
    });

    const studentNum = students.length;
    for (let i = studentNum - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i+1));
      let temp = students[i];
      students[i] = students[j];
      students[j] = temp;
    }
    console.log("Randomized student list: ");
    students.forEach(student => {
      console.log(student.id);
    });

    // Clear POAS assignments
    let poasList = await Poas.findAll();
    for (let poas of poasList) {
      poas.setUser(null);
    };

    for (let student of students) {
      let user_assignment = await UserAssignments.findOne({where: {userId: student.id, assignmentId: assignmentId}});
      let lotteries = await user_assignment.getLotteries({
        order: [
          ['preference', 'ASC']
        ]
      });

      let assigned = false;
      for (let lottery of lotteries) {
        let poas = await Poas.findByPk(lottery.poaId);  // TODO: have to use the odd name for now
        let user = await poas.getUser();
        if (!user) {
          assigned = true;
          poas.setUser(student.id);
          student.poaId = poas.id;
          console.log("Assign student: ", student.id, " to POAS: ", poas.id)
          break;
        }
      }
      if (!assigned) {
        console.log("Unable to assign student: ", student.id);
      }
    }

    res.send({message: "Lottery done!"});
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


exports.addStudent = async (req, res) => {

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