const dotenv = require("dotenv");
dotenv.config();

const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

import { fetchUserByGoogleId, createUser } from '../db/knexUtil.js';

passport.serializeUser(function(user, done) {
  done(null, user.google_id)
})

passport.deserializeUser(async function(google_id, done) {
  try {
    const user = await fetchUserByGoogleId(google_id)
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
      var user = await fetchUserByGoogleId(profile.id);
      if (!user) {
        user = { google_id: profile.id, google_email: profile.emails[0].value };
        createUser(user);
      } 
      return done(null, user);
    } catch(err) {
      console.log(err);
    };
  }
));
