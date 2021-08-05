module.exports = (sequelize, Sequelize) => {
  const Lottery = sequelize.define("lottery", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    content: {
      type: Sequelize.STRING
    }
  });

  return Lottery;
};
