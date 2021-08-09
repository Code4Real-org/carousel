const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./app/models");
const assignmentModel = require("./app/models/assignment.model");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// db.sequelize.sync();
// drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "admin"
  });
 
  Role.create({
    id: 2,
    name: "teacher"
  });
 
  Role.create({
    id: 3,
    name: "student"
  });

  // Root admin account
  User.create({
    id: 1,
    username: "code4real",
    email: "code4real.org@gmail.com",
  })
    .then(user => {
      user.setRoles([1]);
    });

  // Teacher account for testing
  User.create({
    id: 2,
    username: "brookvaleboy",
    email: "brookvaleboy@gmail.com",
  })
    .then(user => {
      user.setRoles([2]);
    });

  // Sample student account
  User.create({
    id: 3,
    username: "flozhao",
    email: "florence.y.zhao@gmail.com",
  })
    .then(user => {
      user.setRoles([3]);
    });

  Assignment.create({
    id: 1,
    title: "Person of American Significance",
    description: "Choose a person of American significance to research and write an essay about. Each student must pick a unique person.",
    maxEntries: 5
  })
    .then(assignment => {
      assignment.setUsers([2, 3]);
    });
};

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require("./app/routes/user.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/teacher.routes")(app);
require("./app/routes/student.routes")(app);
require("./app/routes/assignment.routes")(app);
require("./app/routes/lottery.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
