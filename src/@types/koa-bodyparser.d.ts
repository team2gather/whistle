declare module 'koa-bodyparser' {
  import { Middleware } from "koa";

  export default function bodyParser(): Middleware;
}
