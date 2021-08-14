module.exports = (sequelize, Sequelize) => {
    const UserAssignments = sequelize.define("user_assignments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      }
    });
  
    return UserAssignments;
  };