module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      fname: {
        type: Sequelize.STRING
      },
      lname: {
        type: Sequelize.STRING
      },
      gid: {
        type: Sequelize.STRING(256)
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      }
    });
  
    return User;
  };
  