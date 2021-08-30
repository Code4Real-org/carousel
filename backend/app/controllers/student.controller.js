const db = require("../models");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;

const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");


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


// Retrieve all students with the assignment.
exports.findAll = async (req, res) => {
  const uid = req.userId; // always a teacher
  const assignmentId = parseInt(req.query.assignment);

  try {
    let assignment = await Assignment.findByPk(assignmentId);
    let students = await assignment.getAssignee();
    for (let i = 0; i < students.length; i++) {
      let student = students[i];
      let isStudent = await student.hasRole(3);
      if (!isStudent) {
        students.splice(i, 1);
      }
    }
    res.send(students);
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving students."
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
          name: "student"
        }
      }). then(role => {
        user.addRoles(role).then(() => {
          res.send({ message: "Student was registered successfully!" });
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

      if (user.hasRoles(3)) {
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