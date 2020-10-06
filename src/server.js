const express = require("express");
const bodyParser = require("body-parser");
const {sequelize, User} = require('./model')

const app = express();
const https = require('https');
const fs = require('fs');
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const cors=require('cors');
app.use(cors());

const passport = require("passport");
app.use(passport.initialize());
require("../passportConfig/passport")(passport);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute =  require('./router');
app.use('/user', userRoute);
app.listen(3001, () => console.log(`Example app listening at http://localhost:3001`));