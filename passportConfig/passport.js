const {secret} = require('../config/default.json');
const Users = require("../users");
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

const  opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = secret ;

module.exports = function(passport){
    passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
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
};