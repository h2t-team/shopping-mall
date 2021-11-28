const { models } = require('../model');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    async function (username, password, done) {
        try{
            const user = await models.customer.findOne({ where: { username }, raw: true });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!validPassword(user, password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        }catch(err){
            return done(err);
        }
    }
));

const validPassword = (user, password) => user.password === password;

module.exports = passport