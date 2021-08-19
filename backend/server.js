const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./app/models");
const User = db.user;
const Role = db.role;
const Assignment = db.assignment;
const UserAssignment = db.user_assignments;
const Poas = db.poas;
const Lottery = db.lottery;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// db.sequelize.sync();
// drop the table if it already exists
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
    id: 1,
    username: "code4real",
    email: "code4real.org@gmail.com",
  });
  await user.setRoles([1]);

  // Teacher account for testing
  user = await User.create({
    id: 2,
    username: "brookvaleboy",
    email: "brookvaleboy@gmail.com",
  });
  await user.setRoles([2]);

  // Sample student account
  user = await User.create({
    id: 3,
    username: "flozhao",
    email: "florence.y.zhao@gmail.com",
  });
  await user.setRoles([3]);

  assignment = await Assignment.create({
    id: 1,
    title: "Person of American Significance",
    description: "Choose a person of American significance to research and write an essay about. Each student must pick a unique person.",
    maxEntries: 5
  });
  await assignment.setUsers([2, 3]);

  poas = await Poas.create({
    id: 1,
    firstName: "Ray",
    lastName: "Kloc",
    count: 1
  });

  lottery = await Lottery.create({
    id: 1,
    firstName: "Ray",
    lastName: "Kloc",
    biography: "bio",
    statement: "my statement",
    poaId: 1,
    userAssignmentId: 2
  });
  //lottery.poaId = 1;  // watch out for this generated name, it should have been Poas

  //userAssignment = await UserAssignment.findByPk(2);
  //lottery.userAssignmentId = userAssignment.id;
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
