module.exports = (sequelize, Sequelize) => {
    const UserAssignments = sequelize.define("user_assignments", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sequence: {
        type: Sequelize.INTEGER
      },
      personId: {
        type: Sequelize.INTEGER
      },
      poasFirstName: {
        type: Sequelize.STRING
      },
      poasMiddleName: {
        type: Sequelize.STRING
      },
      poasLastName: {
        type: Sequelize.STRING
      }
    });
  
    return UserAssignments;
  };