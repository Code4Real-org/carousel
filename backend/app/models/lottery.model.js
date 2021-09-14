module.exports = (sequelize, Sequelize) => {
  const Lottery = sequelize.define("lotteries", {
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
    },
    assigned: {
      type: Sequelize.INTEGER
    },
    preference: {
      type: Sequelize.INTEGER
    }
  });

  return Lottery;
};
