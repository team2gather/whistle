import * as React from 'react';
import { Context } from 'koa';

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

export const Payment: ViewFn<null> = (ctx) =>
  <div>
    <p>You paid blah.</p>
  </div>