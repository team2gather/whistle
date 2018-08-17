import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { User } from "../views/user";

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(User(ctx));
}