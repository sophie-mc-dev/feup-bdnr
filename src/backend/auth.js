const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const collection = require('./app');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    // Finde user by email
    const user = await collection.get(email);

    if (!user) {
        return done(null, false, { message: 'Wrong email' });
    }

    // Match password
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch){
            return done(null, user);
        } else {
            return done(null, false, {message: 'Incorrect password'});
        }
    });
}));

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    const user = await collection.get(email);
    done(null, user);
});

module.exports = passport;