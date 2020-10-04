const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, User, Book} = require('./model')
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
    console.log("login");
    const { email, password } = req.body;
    console.log("email : ", email);
    console.log("password : ", password);
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

router.get('/books', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    const booksList = await Book.findAll({attributes: ['title']});
    const parsedBooksTitles = booksList.map((titles) => titles.get({ plain: true }));
    res.json(parsedBooksTitles);
})



module.exports = router;
