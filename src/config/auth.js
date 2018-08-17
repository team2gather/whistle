const dotenv = require("dotenv");
dotenv.config();

const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const knex = require('../db/knex.js');

function fetchUser(googleId) {
  return new Promise((resolve, reject) => {
    knex('users').where('google_id', googleId).then((rows) => {
      resolve(rows[0]);
    }).catch((err) => {
      reject({});
    });
  });
};

passport.serializeUser(function(user, done) {
  done(null, user.google_id)
})

passport.deserializeUser(async function(google_id, done) {
  try {
    const user = await fetchUser(google_id)
    done(null, user)
  } catch(err) {
    done(err)
  }
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SEC,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      var user = await fetchUser(profile.id);
      if (!user) {
        user = { google_id: profile.id, google_email: profile.emails[0].value };
        knex('users').insert(user).then();
      } 
      return done(null, user);
    } catch(err) {
      console.log(err);
    };
  }
));
