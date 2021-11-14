const db = require("../models");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const UserAssignment = db.user_assignments;

const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");


// Retrieve all Assignments from the database.
exports.findAllAssignments = (req, res) => {
  const uid = req.userId;

  User.findByPk(uid)
    .then(user => {
      user.getAssigned().then(data => {
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
    const assignment = await Assignment.findByPk(assignmentId);
    const studentAssignments = await assignment.getStudentAssignments({
      include: [
        { model: User, as: 'Student' },
        { model: UserAssignment, as: 'ClassTeacher', where: { teacherId: uid } }
      ]
    });
    res.send(studentAssignments);
  } catch(err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving students."
    });
  }
};


// Delete all students under the assignment.
exports.deleteAll = async (req, res) => {
  const uid = req.userId; // always a teacher
  const assignmentId = parseInt(req.query.assignment);

  try {
    const assignment = await Assignment.findByPk(assignmentId);
    const studentAssignments = await assignment.getStudentAssignments({
      include: [
        { model: UserAssignment, as: 'ClassTeacher', where: { teacherId: uid } }
      ]
    });
    for (let i = 0; i < studentAssignments.length; i++) {
      let studentAssignment = studentAssignments[i];
      studentAssignment.destroy();
    }
    res.send([]);
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