const {secret} = require('../config/default.json');
const Users = require("../users");
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

const  opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
//setting the secret key defined in the config (database.js file)
opts.secretOrKey = secret ;
console.log("jwtFromRequest : ", opts.jwtFromRequest);
console.log("secretOrKey : ", opts.secretOrKey);

//JWT

module.exports = function(passport){ // will look in authorization header  for " JWT token_string..."
    console.log("in here");
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
        console.log("jwt_payload : ", jwt_payload);
        console.log("jwt_payload.userId : ", jwt_payload.userId);
        try{
            const user = await Users.getUserById(jwt_payload.userId);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        }
        catch(err){
            return done(err, false);
        }
    }));
// facebook token and google token


};
