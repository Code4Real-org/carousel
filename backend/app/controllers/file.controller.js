const uploadFile = require("../middleware/upload");
const readline = require('readline');
const fs = require('fs');
const addrs = require("email-addresses");

const db = require("../models");
const User = db.user;
const Role = db.role;
const UserAssignment = db.user_assignments;

const upload = async (req, res) => {
  const assignmentId = parseInt(req.query.assignment);
  const classPeriod= parseInt(req.query.period);

  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const teacherAssignment = await UserAssignment.findOne({ where:
      {
        assignmentId: assignmentId,
        teacherId: req.userId
      }
    });
    const filename = __basedir + "/uploads/" + req.file.originalname;
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filename),
      output: null,
      console: false
    });
    readInterface.on('line', function(line) {
      const email = addrs.parseOneAddress(line);
      console.log("Name: ", email.name, "Address: ", email.address, "Local: ", email.local);
      User.findOrCreate({
        where: { email: email.address },
        defaults: {
          username: email.local,
          email: email.address
        }
      })
        .then(([user, created]) => {
          console.log("Setting role for student");
          user.setRoles([3]);
          user.setAssigned(assignmentId).then(async studentAssignments => {
            const studentAssignment = studentAssignments[0][0];
            await studentAssignment.setClassTeacher(teacherAssignment.id);
            studentAssignment.period = classPeriod;
            studentAssignment.save();
          }).catch(err => {
            console.log("Error setting student assignment");
          });
        })
        .catch(err => {
          console.log("Error in processing email address");
        });
    });


    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

module.exports = {
  upload
};