module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      fname: {
        type: Sequelize.STRING
      },
      lname: {
        type: Sequelize.STRING
      },
      gid: {
        type: Sequelize.STRING(700),
        primaryKey: true,
      }
    });
  
    return User;
  };
  