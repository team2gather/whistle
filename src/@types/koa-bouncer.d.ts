declare module 'koa-bouncer' {
  import { Middleware } from "koa";

  let bouncer: {
    middleware(): Middleware
  };

  export default bouncer;
}
