const { Book, User } = require('../src/model');

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();

async function seed() {
  // create tables
  await Book.sync({ force: true });
  await User.sync({ force: true });
  //insert data
  await Promise.all([
    User.create({
      id: 1,
      email: 'harry.potter@gmail.com',
      password: 'Wizard',
      purchasedBooks: ['Harry Potter', 'Orphan X'],
      type: 'customer'
    }),
    User.create({
      id: 2,
      email: 'johnsnow@gmail.com',
      password: 'Bla',
      purchasedBooks: ['MrKnowAll'], 
      type: 'customer'
    }),
    User.create({
      id: 3,
      email: 'emma@gmail.com',
      password: 'Bla',
      type: 'admin'
    }),
    Book.create({
      id:1,
      title: 'Harry Potter',
      publisher: 'Unknown',
      author: 'J. K. Rowling'
    }),
    Book.create({
      id:2,
      title: 'MrKnowAll',
      publisher: 'Unknown',
      author: 'Bla'
    })
  ]);
}
