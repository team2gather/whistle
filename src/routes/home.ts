import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "../views/home";

// const knex = require('../db/knex.js');
const axios = require('axios');
const querystring = require('querystring');

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Home(ctx));
}
