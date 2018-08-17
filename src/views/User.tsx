import * as React from 'react';
import { Context } from 'koa';

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

export const User: ViewFn<null> = (ctx) =>
  <div>
    <p>Logged in as: {ctx.state.user.id}</p>
  </div>