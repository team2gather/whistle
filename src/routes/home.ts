import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Home } from "../views/home";

// const knex = require('../db/knex.js');

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Home(ctx));
}
