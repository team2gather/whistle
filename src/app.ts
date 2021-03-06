// Load env vars from .env, always run this early
// import dotenv from 'dotenv';
// dotenv.config();

// import debugSetup from 'debug';
// const debug = debugSetup('app.ts');

import Koa from "koa";
const app = new Koa();

import helmet from 'koa-helmet';
app.use(helmet())

import compress from 'koa-compress';
app.use(compress())

import serveStatic from 'koa-static';
import path from 'path';
app.use(serveStatic(path.join(__dirname, '../public'), { maxage: 0 }))

import logger from 'koa-logger';
app.use(logger())

import bodyParser from "koa-body";
app.use(bodyParser())

import bouncer from 'koa-bouncer';
app.use(bouncer.middleware())

require('./config/slackAuth');
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

const session = require('koa-session');
app.keys = ['some secret hurr'];
app.use(session(app)); 

import Router from "koa-router"; 
const router = new Router();

import Routes from './routes';
Routes.forEach(route => route(router))

app.use(router.routes())
 
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`)
})
