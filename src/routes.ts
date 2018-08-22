import * as Home from './routes/home';
import * as Payment from './routes/payment';
import * as User from './routes/user';
import Router from 'koa-router';

const passport = require('koa-passport');

type Route = (router: Router) => Promise<void>;

const home: Route = async (router) => {
  router.get('/', (ctx, next) => {
    if (ctx.session.isNew) {
      next();
    } else {
      ctx.redirect('/user');
    }
  }, Home.get);
};

const payment: Route = async (router) => {
  router.get('/payment', Payment.get),
  router.post('/processPayment', Payment.post),
  router.post('/processSubscription', Payment.processSubscription),
  router.post('/checkAccess', Payment.checkAccess)
};

const user: Route = async (router) => {
  router.get('/user', User.get)
};

const logout: Route = async (router) => {
  router.get('/logout', async (ctx) => {
    ctx.session = null;
    ctx.redirect('/');
  });
};

const auth: Route = async (router) => {
  router.get('/auth/google', passport.authenticate('google', {scope:['https://www.googleapis.com/auth/userinfo.email']})),
  router.get('/auth/google/callback', passport.authenticate('google', {
    // successRedirect: '/user',
    failureRedirect: '/'
  }), async (ctx) => {
    ctx.redirect('/user');
  }),

  router.get('/auth/slack', passport.authenticate('slack')),
  router.get('/auth/slack/callback', passport.authenticate('slack', {
    failureRedirect: '/'
  }), async (ctx) => {
    ctx.redirect('/user');
  }); 

};

export default [
  home,
  payment,
  user,
  logout,
  auth
];
