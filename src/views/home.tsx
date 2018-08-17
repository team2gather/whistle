import * as React from 'react';
import { Context } from 'koa';

const dotenv: any = require("dotenv");
dotenv.config();

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

export const Home: ViewFn<null> = (ctx) =>
  <div>
      <p>"Hello World!"</p>
      <form action="processPayment" method="POST">
      <script
        src="https://checkout.stripe.com/checkout.js" 
        className="stripe-button"
        data-key={process.env.STRIPE_TEST_PUB_KEY}
        data-amount="999"
        data-name="team2gather.github.io"
        data-description="Widget"
        data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
        data-locale="auto">
      </script>
    </form>
    {/* <p><a href="/auth/google">Sign In with Google</a></p> */}
    <p><a href="/auth/slack">Sign In with Slack</a></p>
  </div>
  