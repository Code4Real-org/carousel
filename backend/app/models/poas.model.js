module.exports = (sequelize, Sequelize) => {
  const Poas = sequelize.define("poas", {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    middleName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    count: {
      type: Sequelize.INTEGER
    }
  });

  return Poas;
};
