module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("student", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    }
  });



  return Student;

};