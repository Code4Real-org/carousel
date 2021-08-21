const { authJwt } = require("../middleware");
const controller = require("../controllers/teacher.controller");

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

  app.use("/api/teacher/assignments", authJwt.verifyToken, authJwt.isTeacher, assignmentRouter);

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