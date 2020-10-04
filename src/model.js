const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

class User extends Sequelize.Model {}
User.init(
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    purchasedBooks:{
      type:Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: true
    },
    type: {
      type: Sequelize.ENUM('customer', 'admin'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User'
  }
);

class Book extends Sequelize.Model {}
Book.init(
  {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    publisher: {
      type: Sequelize.STRING,
      allowNull: false
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: 'Book'
  }
);



module.exports = {
  sequelize,
  User,
  Book
};
