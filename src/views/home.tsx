import * as React from 'react';
import { Context } from 'koa';

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

export const Home: ViewFn<null> = (ctx) =>
  <div>
    "Hello World!"
  </div>
