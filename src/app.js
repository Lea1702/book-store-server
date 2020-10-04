const express = require('express');
const bodyParser = require('body-parser');
const {sequelize, User} = require('./model')
const {getUser} = require('./middleware/getUser')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
const { Op } = require("sequelize");
app.set('models', sequelize.models)
const Users= require("../users");


app.post('/register', async function (req, res) {
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


app.post('/login', async function (req, res) {
    console.log("login");
    const { email, password } = req.body;
    console.log("email : ", email);
    console.log("password : ", password);
    try {
        const user = await Users.login(email, password);
        res.status(200).json({
            message: "Login Success",
            user: email
        });
    }
    catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});


module.exports = app;
