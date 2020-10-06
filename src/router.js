const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, User, Book, UserToBook} = require('./model')
const {getUser} = require('./middleware/getUser')
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
        res.status(500).json({ message: `Failed at registration, ${err}` });
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
        res.status(500).json({ message: `${error}` });
    }
});

router.get('/books', async (req, res) =>{
    const booksList = await Book.findAll();
    const parsedBooksTitles = booksList.map((books) => books.get({ plain: true }));
    res.json(parsedBooksTitles);
})

router.get('/books/purchased', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    const purchasedBooksTitles = await UserToBook.findAll({attributes: ['book_id'], where: {user_id: req.user.id}});
    const parsedPurchasedBooksTitles = purchasedBooksTitles.map((titles) => titles.get({ plain: true }));
    res.json(parsedPurchasedBooksTitles);
})

router.post('/books/purchase', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        const {book_id} = req.body
        let userToBook = await UserToBook.findOne({where : { [Op.and] : [{book_id:  book_id}, {user_id:req.user.id}]}});
        if (userToBook) {
            res.json({ message: "book already purchased" });
        }
        let newUserToBook = await UserToBook.create({book_id:  book_id, user_id:req.user.id});
        res.json("purchased"); 
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.post('/book/create', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.status(404).json({ message: 'Only admin can create a book' });
        }
        const {title, publisher, author} = req.body
        let book = await Book.create({title:  title, publisher:publisher, author: author});
        res.json("created"); 
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.put('/book/update', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.status(404).json({ message: 'Only admin can update a book' });
        }
        const {title, publisher, author, id} = req.body
        let book = await Book.update({title:  title, publisher:publisher, author: author} ,{where: {id: id}});
        res.json("updated"); 
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

router.delete('/book/delete/:id', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if (req.user.type === "customer"){
            res.status(404).json({ message: 'Only admin can update a book' });
        }
        const  {id} = req.params;
        let book = await Book.destroy({where: {id: id}});
        res.json("deleted"); 
    }
    catch(err){
        res.status(404).json({ message: `${err}` });
    }
})

module.exports = router;