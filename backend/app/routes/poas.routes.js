const { authJwt } = require("../middleware");

module.exports = app => {
  const poases = require("../controllers/poas.controller.js");

  var router = require("express").Router();

  // Create a new poas
  router.post("/", poases.create);

  // Retrieve all poases
  router.get("/", poases.findAll);

  // For both students and the teacher
  app.use('/api/poases', authJwt.verifyToken, authJwt.isTeacherOrStudent, router);
};
