const express = require("express");
const { authJwt } = require("../middleware");
const controller = require("../controllers/teacher.controller");
const student = require("../controllers/student.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const assignmentRouter = express.Router();

  // Retrieve all Assignments
  assignmentRouter.get("/", controller.findAllAssignments);

  // Retrieve a single Assignment with id
  assignmentRouter.get("/:id", controller.findOneAssignment);

   // Do a lottery
   assignmentRouter.post("/lottery", controller.doLottery);

   // Return lottery result
   assignmentRouter.get("/lottery", controller.showLottery);

  app.use("/api/teacher/assignments", authJwt.verifyToken, authJwt.isTeacher, assignmentRouter);

  const studentsRouter = express.Router();

  studentsRouter.get("/", student.findAll);

  app.use("/api/teacher/students", authJwt.verifyToken, authJwt.isTeacher, studentsRouter);

  app.post(
    "/api/teacher/signup",
    [
        authJwt.verifyToken, 
        authJwt.isAdmin
    ],
    controller.signup
  );

  app.post("/api/teacher/signin", controller.signin);
};