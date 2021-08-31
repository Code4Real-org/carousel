const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const UserAssignments = db.user_assignments;
const Poas = db.poas;
const poasController = require("../controllers/poas.controller");
const common = require("../util/common.js")

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { poas } = require("../models");

// Retrieve all Assignments from the database.
exports.findAllAssignments = (req, res) => {
  const uid = req.userId;

  User.findByPk(uid)
    .then(user => {
      user.getAssignment().then(data => {
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
    let students = await assignment.getAssignee();
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
      console.log(student.userId);
    });

    //const studentNum = students.length;
    /*
    for (let i = studentNum - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i+1));
      let temp = students[i];
      students[i] = students[j];
      students[j] = temp;
    }
    */
    for (let i = 0; i < 3; i++) {
      common.shuffleOnce(students);
    }

    console.log("Randomized student list: ");
    students.forEach(student => {
      console.log(student.userId);
    });

    // Clear POAS assignments
    let userAssignmentList = await UserAssignments.findAll({where: {assignmentId: assignmentId}});
    for (let userAssignment of userAssignmentList) {
      userAssignment.setPoa(null);
      userAssignment.sequence = 0;
    };

    for (let index = 0; index < students.length; index++) {
      let student = students[index];
      let user_assignment = await UserAssignments.findOne({where: {userId: student.userId, assignmentId: assignmentId}});
      let lotteries = await user_assignment.getLotteries({
        order: [
          ['preference', 'ASC']
        ]
      });

      user_assignment.sequence = index + 1;
      let assigned = false;
      for (let lottery of lotteries) {
        let poas = await Poas.findByPk(lottery.poaId);  // TODO: have to use the odd name for now
        if (!poas.userAssignmentId) {
          assigned = true;
          user_assignment.setPoa(poas.id);
          console.log("Assign student: ", student.userId, " to POAS: ", poas.id)
          break;
        }
      }
      user_assignment.save();
      if (!assigned) {
        console.log("Unable to assign student: ", student.userId);
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
    let userAssignments = await UserAssignments.findAll({ where: {
        assignmentId: assignmentId,
        sequence: { [Op.gt]: 0 }
      }, order: [
        ['sequence', 'ASC']
      ], include: [
        { model: Poas },
        { model: User }
      ]
    });

    res.send(userAssignments);
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
        var token = jwt.sign({ id: user.userId }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

        res.status(200).send({
          id: user.userId,
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

