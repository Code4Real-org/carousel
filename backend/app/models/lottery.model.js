module.exports = (sequelize, Sequelize) => {
  const Lottery = sequelize.define("lottery", {
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
