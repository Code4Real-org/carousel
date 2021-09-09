const { authJwt } = require("../middleware");
const controller = require("../controllers/student.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const assignmentRouter = require("express").Router();

  // Retrieve all Assignments
  assignmentRouter.get("/", controller.findAllAssignments);

  // Retrieve a single Assignment with id
  assignmentRouter.get("/:id", controller.findOneAssignment);

  app.use("/api/student/assignments", authJwt.verifyToken, authJwt.isStudent, assignmentRouter);

  app.post(
    "/api/student/signup",
    [
        authJwt.verifyToken,
        authJwt.isTeacher
    ],
    controller.signup
  );

  app.delete(
    "/api/student",
    [
        authJwt.verifyToken,
        authJwt.isTeacher
    ],
    controller.deleteAll
  );

  app.post("/api/student/signin", controller.signin);
};