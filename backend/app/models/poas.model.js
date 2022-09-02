module.exports = (sequelize, Sequelize) => {
  const Poas = sequelize.define("poas", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    wikiLink: {
      type: Sequelize.STRING,
    },
    wikiPageID: {
      type: Sequelize.INTEGER
    },
    wikiDescription: {
      type: Sequelize.STRING
    },
    /*middleName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    normalizedName: {
      type: Sequelize.STRING,
      allowNull: false
    },*/
    count: {
      type: Sequelize.INTEGER
    }
  });

  return Poas;
};
