import * as React from 'react';
import { Context } from 'koa';

var moment = require('moment');
moment().format();

type ViewFn<P> = (ctx: Context, params?: P) => JSX.Element;

type UserParams = {
  slackId: string,
  teamId: string,
  email: string,
  subscriptionActive: boolean,
  transactions: any[] 
};

export const User: ViewFn<UserParams> = (ctx, params) =>
  <div>
    <p>Logged in as: {params ? params.email : ""}</p>
    
    {params ? "Subscription Valid: " + params.subscriptionActive : ""}  

    {/* <form action="/checkAccess" method="POST">
      <p>1 Time Charge</p>
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
    </form> */}
  
    <form action="/checkTeamAccess" method="POST">
      <p>Subscription</p>
      <input type="hidden" name="slackId" value={params ? params.slackId : ""}/>
      <input type="hidden" name="teamId" value={params ? params.teamId : ""}/>
      <script
        src="https://checkout.stripe.com/checkout.js"  
        className="stripe-button"
        data-key={process.env.STRIPE_TEST_PUB_KEY}
        data-email={params ? params.email : ""}
        data-image="https://stripe.com/img/documentation/checkout/marketplace.png"
        data-name="Subscription"
        data-description="test"
        data-amount="1555"
        data-label="Sign Me Up!">
      </script>
    </form>

    {params ? params.transactions.map(transact => {
      return <div>
        --------
        <p>Date: {moment.unix(transact.created).format('l LT')}</p>
        <p>Item: {transact.description}</p>
        <p>Amount: {transact.amount}</p>
        --------
      </div>;
    }) : ""} 

  </div>