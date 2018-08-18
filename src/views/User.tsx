import * as React from 'react';
import { Context } from 'koa';

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

type UserParams = {
  email: string,
  transactions: any[]
};

export const User: ViewFn<UserParams> = (ctx, params) =>
  <div>
    <p>Logged in as: {params ? params.email : ""}</p>
    
    <form action="processPayment" method="POST">
      <script
        src="https://checkout.stripe.com/checkout.js" 
        className="stripe-button"
        data-email={params ? params.email : ""}
        data-key={process.env.STRIPE_TEST_PUB_KEY}
        data-amount="999"
        data-name="team2gather.github.io"
        data-description="Widget"
        data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
        data-locale="auto">
      </script>
    </form>

    {params ? params.transactions.map(transact => {
      return <div>
        --------
        <p>Date: {transact.created}</p>
        <p>Item: {transact.description}</p>
        <p>Amount: {transact.amount}</p>
        --------
      </div>;
    }) : ""} 

  </div>