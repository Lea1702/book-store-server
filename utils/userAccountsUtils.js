const crypto = require("crypto");
var bcrypt = require('bcryptjs');

module.exports.generateToken = async function() {
    const token = await new Promise((res, rej) => {
        crypto.randomBytes(20,function(err, buf){
            if(err) rej(err)
            res(buf.toString('hex'));
        });
    });
    return token;
};

module.exports.hashPassword = async function(password){
    const hashedPassword = await new Promise((res, rej) => {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) rej(err);
                res(hash);
            })
        })
    });
    return hashedPassword;
};

