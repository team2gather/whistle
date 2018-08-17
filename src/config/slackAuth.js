const dotenv = require("dotenv");
dotenv.config();

const passport = require('koa-passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const axios = require('axios');
const querystring = require('querystring');

import { fetchUserByEmail, createUser, updateUser } from '../db/knexUtil.js';

passport.serializeUser(function(user, done) {
  done(null, user.email)
})

passport.deserializeUser(async function(email, done) {
  try {
    const user = await fetchUserByEmail(email);
    done(null, user.data);
  } catch(err) {
    done(err)
  }
})

passport.use('slack', new OAuth2Strategy({
  authorizationURL: 'https://slack.com/oauth/authorize',
  tokenURL: 'https://slack.com/api/oauth.access',
  scope: ['identity.basic', 'identity.email', 'identity.team'],
  clientID: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/slack/callback'
},
  async function(accessToken, refreshToken, profile, done) {
    let response = await axios.post("https://slack.com/api/users.identity", querystring.stringify({
      token: accessToken
    }));
    const data = response.data;
    try {
      var existingUser = await fetchUserByEmail(data.user.email);
      if (!existingUser || !existingUser.data.id || !existingUser.data.token) {
        const user = { 
          token: accessToken,
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          teamName: data.team.name,
          teamId: data.team.id,
          teamDomain: data.team.domain
        };
        if (!existingUser) {
          createUser({email: data.user.email, data: user});
        } else {
          const update = {...existingUser.data, ...user};
          updateUser({email: data.user.email}, {data: update});
        }
        return done(null, user); 
      } else {
        return done(null, existingUser.data); 
      }
    } catch(err) {
      console.log(err);
    };
  }
));