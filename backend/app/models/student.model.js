module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    poas1: {
      type: Sequelize.STRING,
    },
    sig1: {
      type: Sequelize.STRING,
    },
    bio1: {
      type: Sequelize.STRING,
    },

  });



  return Student;

};