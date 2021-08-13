const { authJwt } = require("../middleware");

module.exports = app => {
  const lotteries = require("../controllers/lottery.controller.js");

  var router = require("express").Router();

  // Create a new Lottery
  router.post("/", lotteries.create);

  // Retrieve all Lotteries
  router.get("/", lotteries.findAll);

  // Retrieve a single Lottery with id
  router.get("/:id", lotteries.findOne);

  // Update a Lottery with id
  router.put("/:id", lotteries.update);

  // Delete a Lottery with id
  router.delete("/:id", lotteries.delete);

  // Delete all Lotteries
  router.delete("/", lotteries.deleteAll);

  // ToDo: Assuming for student use, need to provide for teachers too
  app.use('/api/lotteries', authJwt.verifyToken, authJwt.isStudent, router);
};
