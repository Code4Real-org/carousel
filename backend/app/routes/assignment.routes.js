module.exports = app => {
  const assignments = require("../controllers/assignment.controller.js");

  var router = require("express").Router();

  // Create a new Assignment
  router.post("/", assignments.create);

  // Update a Assignment with id
  router.put("/:id", assignments.update);

  // Delete a Assignment with id
  router.delete("/:id", assignments.delete);

  // Delete all Assignments
  router.delete("/", assignments.deleteAll);

  app.use('/api/assignments', router);
};