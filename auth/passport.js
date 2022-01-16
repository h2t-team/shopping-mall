const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { models } = require('../model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const authService = require('../components/auth/authService')

passport.use(new LocalStrategy(
    async function(username, password, done) {
        try {
            const user = await models.customer.findOne({ where: { username }, raw: true });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (user.lock) {
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
passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
        },
        async(token, refreshToken, profile, done) => {

            console.log("profile", profile);
            try {
                const user = await models.customer.findOne({ where: { username: profile.id }, raw: true });
                if (!user) {
                    var newuser = await authService.createUser({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        birthday: new Date(2000, 1, 1),
                        username: profile.id,
                        hashPassword: "1",
                        telephone: profile.id.substring(0, 10),
                        email: profile._json.email
                    });
                    console.log("new usser ", newuser);
                    const status = 'active';
                    await authService.updateUserStatus(newuser.id, status);
                    const returnUser = await models.customer.findOne({ where: { username: profile.id }, raw: true });
                    return done(null, returnUser);
                }
                if (user.lock) {
                    return done(null, false, { message: 'Your account is locked.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
}, async(token, refreshToken, profile, done) => {
    try {
        const user = await models.customer.findOne({ where: { username: profile.id }, raw: true });
        const index = profile.displayName.indexOf(" ");
        const last_name = profile.displayName.substring(0, index);
        const first_name = profile.displayName.substring(index + 1);
        if (!user) {
            var newuser = await authService.createUser({
                firstname: first_name,
                lastname: last_name,
                birthday: new Date(2000, 1, 1),
                username: profile.id,
                hashPassword: "1",
                telephone: profile.id.substring(0, 10),
                email: profile._json.email
            });
            console.log("new usser ", newuser);
            const status = 'active';
            await authService.updateUserStatus(newuser.id, status);
            const returnUser = await models.customer.findOne({ where: { username: profile.id }, raw: true });
            return done(null, returnUser);
        }
        if (user.lock) {
            return done(null, false, { message: 'Your account is locked.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}))

const validPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    models.customer.findByPk(id, { raw: true })
        .then(res => done(null, res))
        .catch(err => done(err));
});

module.exports = passport