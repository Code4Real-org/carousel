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
    minEntries: {
      type: Sequelize.INTEGER
    },
    maxEntries: {
      type: Sequelize.INTEGER
    },
    dueDate: {
      type: Sequelize.DATEONLY
    },
    state: {
      type: Sequelize.INTEGER
    }
  });

  return Assignment;
};
