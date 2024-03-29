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

  const router = express.Router();

  // Retrieve all Assignments
  router.get("/assignments", controller.findAllAssignments);

  // Retrieve a single Assignment with id
  router.get("/assignments/:id", controller.findOneAssignment);

  // Lock further lottery entry
  router.post("/lottery/lock", controller.lockLottery);

  // Reopen lottery entry
  router.delete("/lottery/lock", controller.unlockLottery);

  // Run a lottery
  router.post("/lottery", controller.runLottery);

  // Continue with a lottery in progress
  router.put("/lottery", controller.runLottery);

  // Return lottery result
  router.get("/lottery", controller.showLottery);

  router.get("/students", student.findAll);

  app.use("/api/teacher", authJwt.verifyToken, authJwt.isTeacher, router);

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