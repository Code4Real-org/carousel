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

db.user_assignments.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'userId',
  //as: 'User'
});
db.user_assignments.belongsTo(db.assignment, {
  foreignKey: 'assignmentId',
  targetKey: 'assignmentId',
  as: 'Assignment'
});
db.assignment.belongsToMany(db.user, {
  through: "user_assignments",
  foreignKey: 'assignmentId',
  otherKey: "userId",
  as: "Assigner"
});
db.assignment.belongsToMany(db.user, {
  through: "user_assignments",
  foreignKey: 'assignmentId',
  otherKey: "userId",
  as: "Assignee"
});
db.user.belongsToMany(db.assignment, {
  through: "user_assignments",
  foreignKey: 'userId',
  as: "Assignment"
});
db.user.belongsToMany(db.assignment, {
  through: "user_assignments",
  foreignKey: 'userId',
  as: "Assigned"
});

db.user_assignments.hasMany(db.lottery);
db.user_assignments.hasOne(db.poas);
db.poas.hasMany(db.lottery);

db.ROLES = ["admin", "teacher", "student"];

module.exports = db;