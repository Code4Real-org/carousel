module.exports = (sequelize, Sequelize) => {
  const Assignment = sequelize.define("assignments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    maxEntries: {
      type: Sequelize.INTEGER
    }
  });

  return Assignment;
};
