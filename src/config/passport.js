const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const UserModel = require('../models/userModel');

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: 'email' }, async (email, password, done) => {

            const user = await UserModel.findOne({ email: email });
            if (!user) return done(null, false, { message: "User does not exist" });

            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch) return done(null, false, { message: "Wrong password" });
            return done(null, user);
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        UserModel.findById(id, function(err, user) {
          done(err, user);
        });
    });
};