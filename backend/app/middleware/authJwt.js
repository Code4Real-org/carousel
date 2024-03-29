const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  // for testing only, skip the real check for special tokens (to be removed afterwards)
  if (!isNaN(token)) {
    req.userId = parseInt(token, 10);
    next();
    return;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isTeacher = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "teacher") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Teacher Role!"
      });
    });
  });
};

isStudent = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "student") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Student Role!"
      });
    });
  });
};

isTeacherOrStudent = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "teacher" || roles[i].name === "student") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Teacher Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isTeacher: isTeacher,
  isTeacherOrStudent: isTeacherOrStudent,
  isStudent: isStudent
};
module.exports = authJwt;