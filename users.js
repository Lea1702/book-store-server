const jwt = require('jsonwebtoken');
const { secret } = require('./config/default.json');
var bcrypt = require('bcryptjs');
const userAccountsUtils = require("./utils/userAccountsUtils.js");
const { User} = require('./src/model');


//validtors
const validator = require('validator')
const passwordValidator = require('password-validator')


module.exports.getUserById = async function (userId) {
    const userResult = await  User.findOne({where: {id: userId}})
    return userResult[0];
};

module.exports.login = async function (email, password) {
    const userResult = await User.findOne({where: {email: email}})
    if (userResult.length === 0) throw new Error('User email does not exist');
    else {
        let match = await this.passwordCheck(password, userResult.password);
        if (!match) throw new Error('wrong password');
        const token = jwt.sign({ userId: userResult.id }, secret);
        let userToReturn = userResult;
        userToReturn.token = token;
        return userToReturn;
    }
};

module.exports.passwordCheck = function (plainPassword, hashPassword) {
    return new Promise((res, rej) => {
        console.log("plain password : ", plainPassword);
        console.log("hashPassword : ", hashPassword);
        bcrypt.compare(plainPassword, hashPassword, function (err, respond) {
            if (err) rej(err);
            res(respond);
        })
    })
};

module.exports.saveUser = async function (email, password, type) {
    const notValidResult = this.checkValidation(email, password)
    if (notValidResult)
        throw new Error(notValidResult)
    const userResult = await User.findOne({where: {email: email}})
    if (userResult) throw new Error('email is taken');
    const newUserToCreate = {
        email: email,
        password: await userAccountsUtils.hashPassword(password),
    };
    try {
        const newUser = await User.create({ email: newUserToCreate.email,  password: newUserToCreate.password, type: type});
        console.log("newUser's auto-generated ID:", newUser.id);

    }
    catch (error) {
        throw new Error(`error creating the user in the database ${error}`);
    }
};

module.exports.checkValidation = function (email, password) {
    console.log("password : ", password);
    var schema = new passwordValidator();
    schema
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits()                                 // Must have digits
        .has().not().spaces()                           // Should not have spaces
    if (validator.isEmail(email) && schema.validate(password)) {
        return false;
    }
    if (!validator.isEmail(email))
        return 'Please enter a valid Email';
    else
        return 'Password must have: uppercase,lowercase,digits and at least 8 characters';
};