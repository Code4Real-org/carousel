module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      fname: {
        type: Sequelize.STRING
      },
      lname: {
        type: Sequelize.STRING
      },
      gid: {
        type: Sequelize.STRING,
        primaryKey: true,
      }
    });
  
    return User;
  };
  