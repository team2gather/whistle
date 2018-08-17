import * as Koa from "koa";
import * as stream from "stream";

declare module "koa" {
  export interface Context extends Request, Response {
      session: any
  }
}