const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/student",
    [authJwt.verifyToken, authJwt.isStudent],
    controller.studentBoard
  );

  app.get(
    "/api/teacher",
    [authJwt.verifyToken, authJwt.isTeacher],
    controller.teacherBoard
  );

  app.get(
    "/api/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  var router = require("express").Router();
  // Create a new User
  router.post("/", controller.create);  
  app.use('/api/users', router);
}