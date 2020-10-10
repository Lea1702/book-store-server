const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, Book, UserToBook} = require('./model')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const { Op } = require("sequelize");
const Users= require("../users");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const formatUser = require('../helpers/userResponseFormat');
const router = express.Router();

const cors=require('cors');
const { user } = require('osenv');
app.use(cors());

app.use(passport.initialize());
require("../passportConfig/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/register', async function (req, res) {
    const { email, password, type } = req.body;
    try {
        await Users.saveUser(email, password, type);
        res.status(200).json({
            message: 'Succeffuly signed up'
        })
    }
    catch (err) {
        res.status(404).json({ message: `Failed at registration, ${err}` });
    }
});   


router.post('/login', async function (req, res) {
    const { email, password } = req.body;
    try {
        const user = await Users.login(email, password);
        res.status(200).json({
            message: "Login Success",
            user: formatUser(user)
        });
    }
    catch (error) {
        res.status(404).json({ message: `${error}` });
    }
});

router.get('/books', async (req, res) =>{
    const booksList = await Book.findAll();
    const parsedBooksTitles = booksList.map((books) => books.get({ plain: true }));
    res.json(parsedBooksTitles);
})

router.get('/books/purchased', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    const purchasedBooksIds = await UserToBook.findAll({attributes: ['book_id'], where: {user_id: req.user.id}});
    const parsedPurchasedBooksIds = purchasedBooksIds.map((ids) => ids.get({ plain: true }).book_id);
    const purchasedBooksTitles = await Book.findAll({attributes: ['title', 'id'], where: {id:  {
        [Op.in]: parsedPurchasedBooksIds
      }}});
    const parsedPurchasedBooksTitles = purchasedBooksTitles.map((title) => title.get({ plain: true }));
    res.json(parsedPurchasedBooksTitles);
})

router.post('/books/purchase', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        const {book_id} = req.body
        let userToBook = await UserToBook.findOne({where : { [Op.and] : [{book_id:  book_id}, {user_id:req.user.id}]}});
        if (userToBook) {
            res.status(404).json({ message: "book already purchased" });
        }
        await UserToBook.create({book_id:  book_id, user_id:req.user.id});
        res.json("purchased"); 
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.post('/book/create', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.json({ message: 'Only admin can create a book' });
        }
        else{
            const {title, publisher, author} = req.body
            await Book.create({title:  title, publisher:publisher, author: author});
            res.json({ message:"Successfully created"}); 
        }
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.put('/book/update', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.json({ message: 'Only admin can update a book' });
        }
        else {
            const {title, publisher, author, id} = req.body
            await Book.update({title:  title, publisher:publisher, author: author} ,{where: {id: id}});
            res.json({ message:"Successfully updated"}); 
        }
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.delete('/book/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.json({ message: 'Only admin can update a book' });
        }
        else{
             const {id} = req.params;
             await Book.destroy({where: {id: id}});
             res.json({ message:"Successfully deleted"}); 
        }
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

module.exports = router;