module.exports = (sequelize, Sequelize) => {
  const Poas = sequelize.define("poas", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
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
    counts: {
      type: Sequelize.JSON
    }
  });

  return Poas;
};
