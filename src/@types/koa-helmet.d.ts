declare module 'koa-helmet' {
  import { Middleware } from "koa";

  export default function helmet(): Middleware;
}
