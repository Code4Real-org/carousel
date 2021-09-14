const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const Lottery = db.lottery;
const Poas = db.poas;
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


exports.runLottery = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);

  try {
    let assignment = await Assignment.findByPk(assignmentId);
    let studentAssignments = [];

    if (req.method == 'POST') {
      // Reset POAS assignments only when starting to run a new lottery
      studentAssignments = await assignment.getStudentAssignments();
      for (let studentAssignment of studentAssignments) {
        const lotteries = await studentAssignment.getLotteries();
        for (let index = 0; index < lotteries.length; index++) {
          const lottery = lotteries[index];
          lottery.assigned = 0;
          await lottery.save();
        }
        await studentAssignment.setPoa(null);
        studentAssignment.sequence = 0;
        studentAssignment.preferenceChosen = 0; // unassigned
        await studentAssignment.save();
      }

      // Third time is the charm
      for (let i = 0; i < 3; i++) {
        common.shuffleOnce(studentAssignments);
      }
      // record the order determined by lottery
      studentAssignments.forEach((studentAssignment, index) => {
        studentAssignment.sequence = index + 1;
        studentAssignment.save();
      });
    } else {
      studentAssignments = await assignment.getStudentAssignments({
        order: [
          ['sequence', 'ASC']
        ]
      });
    }

    let isCompleted = true;
    for (let index = 0; index < studentAssignments.length; index++) {
      let studentAssignment = studentAssignments[index];

      let assigned = studentAssignment.preferenceChosen;
      if (assigned) continue;   // already assigned

      let lotteries = await studentAssignment.getLotteries({
        order: [
          ['preference', 'ASC']
        ]
      });
      for (let index2 = 0; index2 < lotteries.length; index2++) {
        let lottery = lotteries[index2];
        let poas = await lottery.getPoa();  // TODO: have to use the odd name for now
        if (!poas.userAssignmentId) {
          assigned = index2 + 1;
          await studentAssignment.setPoa(poas.id);
          studentAssignment.preferenceChosen = index2 + 1;
          lottery.assigned = studentAssignment.preferenceChosen;
          await studentAssignment.save();
          await lottery.save();
          console.log("Assign student: ", studentAssignment.studentId, " to POAS: ", poas.id)
          break;
        }
      }
      if (!assigned) {
        isCompleted = false;
        console.log("Unable to assign student: ", studentAssignment.studentId);
      }
    }

    if (isCompleted) assignment.state = 3;  // 3: completed state
    else assignment.state = 2;  // 2: in progress
    assignment.save();
    res.send(assignment);
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while conducting lottery."
    });
  }
};


exports.lockLottery = async (req, res) => {
  const assignmentId = parseInt(req.query.assignment);
  let assignment = await Assignment.findByPk(assignmentId);
  if (assignment.state > 0) {
    console.log("Lottery already locked");
    res.status(409).send({message: "Lottery already locked!"});
    return;
  }

  assignment.state = 1; // 1: locked state
  assignment.save();
  res.send(assignment);
};


exports.unlockLottery = async (req, res) => {
  const assignmentId = parseInt(req.query.assignment);
  let assignment = await Assignment.findByPk(assignmentId);
  if (assignment.state == 0) {
    console.log("Lottery already unlocked");
    res.status(409).send({message: "Lottery already unlocked!"});
    return;
  }

  assignment.state = 0; // 0: unlocked, open for submissions
  assignment.save();
  res.send(assignment);
};


exports.showLottery = async (req, res) => {
  const uid = req.userId;
  const assignmentId = parseInt(req.query.assignment);
  const assignment = await Assignment.findByPk(assignmentId);

  try {
    let userAssignments = await assignment.getStudentAssignments({
      order: [
        ['sequence', 'ASC']
      ], include: [
        { model: Poas },
        { model: Lottery, as: 'lotteries' },
        { model: User, as: 'Student' }
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

