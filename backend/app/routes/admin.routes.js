const express = require("express");
const { authJwt } = require("../middleware");
const teacherController = require("../controllers/teacher.controller");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/admin/signin", controller.signin);

  const router = express.Router();

  // Retrieve all Teachers
  router.get("/teacher", teacherController.findAll);

  app.use("/api/admin", authJwt.verifyToken, authJwt.isAdmin, router);
};