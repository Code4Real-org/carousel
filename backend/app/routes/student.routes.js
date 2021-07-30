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

  app.post(
    "/api/student/signup",
    [
        authJwt.verifyToken,
        authJwt.isTeacher
    ],
    controller.signup
  );

  app.post("/api/student/signin", controller.signin);
};