const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./app/models");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const Lottery = db.lottery;
const Poas = db.poas;

const app = express();

global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// db.sequelize.sync();
// drop the table if it already exists (not anymore)
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  initial();
});

async function initial() {
  await Role.create({
    id: 1,
    name: "admin"
  });
 
  await Role.create({
    id: 2,
    name: "teacher"
  });
 
  await Role.create({
    id: 3,
    name: "student"
  });

  // Root admin account
  user = await User.create({
    userId: 1,
    username: "code4real",
    email: "code4real.org@gmail.com",
  });
  await user.setRoles([1]);

  // Teacher account for testing
  user = await User.create({
    userId: 2,
    username: "brookvaleboy",
    email: "brookvaleboy@gmail.com",
  });
  await user.setRoles([2]);

  // Sample student account
  user = await User.create({
    userId: 3,
    username: "florence.y.zhao",
    email: "florence.y.zhao@gmail.com",
  });
  await user.setRoles([3]);

  assignment = await Assignment.create({
    assignmentId: 1,
    title: "Person of American Significance",
    description: "Choose a person of American significance to research and write an essay about. Each student must pick a unique person.",
    minEntries: 3,
    maxEntries: 5,
    state: 0  // default: open
  });
  await assignment.addAssigner([2]);
  await assignment.addAssignee([3]);

  poas1 = await Poas.create({
    id: 1,
    firstName: "Ray",
    lastName: "Kroc",
    count: 1
  });

  poas2 = await Poas.create({
    id: 2,
    firstName: "Howard",
    lastName: "Hughes",
    count: 1
  });

  lottery1 = await Lottery.create({
    id: 1,
    firstName: "Ray",
    lastName: "Kroc",
    biography: "bio",
    statement: "my statement",
    preference: 1,
    poaId: 1,
    userAssignmentId: 2
  });

  lottery2 = await Lottery.create({
    id: 2,
    firstName: "Howard",
    lastName: "Hughes",
    biography: "Bio",
    statement: "Statement",
    preference: 2,
    poaId: 2,
    userAssignmentId: 2
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
require("./app/routes/file.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
