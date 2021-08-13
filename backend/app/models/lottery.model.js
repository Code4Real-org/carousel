module.exports = (sequelize, Sequelize) => {
  const Lottery = sequelize.define("lottery", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    middleName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    biography: {
      type: Sequelize.STRING
    },
    statement: {
      type: Sequelize.STRING
    }
  });

  return Lottery;
};
