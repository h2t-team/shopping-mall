const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { models } = require('../model');

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await models.customer.findOne({ where: { username }, raw: true });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if(user.lock){
                return done(null, false, { message: 'Your account is locked.' });
            }
            if (!validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

const validPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.customer.findByPk(id, { raw: true })
        .then(res => done(null, res))
        .catch(err => done(err));
});

module.exports = passport