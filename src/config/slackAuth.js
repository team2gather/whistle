const dotenv = require("dotenv");
dotenv.config();

const passport = require('koa-passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const axios = require('axios');
const querystring = require('querystring');

import { fetchUser, createUser, updateUser } from '../db/knexUtil.js';

passport.serializeUser(function(user, done) {
  done(null, user.slack_id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await fetchUser('slack_id', id);
    done(null, user);
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
    console.log('oauth data', data);
    try {
      var existingUser = await fetchUser('slack_id', data.user.id);
      if (!existingUser || !existingUser.slack_id) {
        const user = { 
          slack_id: data.user.id,
          email: data.user.email,
          user_data: {
            name: data.user.name,
          },
          team_id: data.team.id,
          team_data: {
            name: data.team.name,
            domain: data.team.domain
          }
        };
        if (!existingUser) {
          createUser(user);
        } else {
          const update = {...existingUser, ...user};
          updateUser({slack_id: data.user.id}, ...user);
        }
        return done(null, user); 
      } else {
        return done(null, existingUser); 
      }
    } catch(err) {
      console.log(err);
    };
  }
));