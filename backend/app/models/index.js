const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.assignment = require("../models/assignment.model.js")(sequelize, Sequelize);
db.user_assignments = require("../models/user_assignments.model.js")(sequelize, Sequelize);
db.lottery = require("../models/lottery.model.js")(sequelize, Sequelize);
db.poas = require("../models/poas.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.assignment.belongsToMany(db.user, {
  through: "user_assignments",
  uniqueKey: "userAssignmentsId"
});
db.user.belongsToMany(db.assignment, {
  through: "user_assignments",
  uniqueKey: "userAssignmentsId"
});

db.user_assignments.hasMany(db.lottery);
db.lottery.hasOne(db.poas);

db.ROLES = ["admin", "teacher", "student"];

module.exports = db;
