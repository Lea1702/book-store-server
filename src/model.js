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

class UserToBook extends Sequelize.Model {}
UserToBook.init(
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    book_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'UserToBook'
  }
);

User.hasMany(UserToBook, {foreignKey:'user_id'})
UserToBook.belongsTo(User)
Book.hasMany(UserToBook, {foreignKey:'book_id'})
UserToBook.belongsTo(Book)

module.exports = {
  sequelize,
  User,
  Book,
  UserToBook
};