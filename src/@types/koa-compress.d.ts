declare module 'koa-compress' {
  import { Middleware } from "koa";

  export default function compress(): Middleware;
}
