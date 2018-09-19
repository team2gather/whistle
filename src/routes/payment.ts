import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Payment } from "../views/payment";
import * as KnexUtil from '../db/knexUtil.js';
import { reject } from "bluebird";

var moment = require('moment');
moment().format();

const dotenv: any = require("dotenv");
dotenv.config();
var stripe = require("stripe")(process.env.STRIPE_TEST_SEC_KEY);

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}

async function createOrFindStripeCustomer(slackId: string, teamId: string, email: string, token: string) {
  const existingCustomer = await KnexUtil.fetchUser('slack_id', slackId);
  console.log(existingCustomer);
  if (!existingCustomer) {
    reject('Slack user does not exist: ' + slackId); 
  }
  let stripeCustomerId = existingCustomer.stripe_id;
  // not connected to stripe
  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      source: token,
      email: email,
      metadata: {
        'slack_id': slackId,
        'team_id': teamId
      }
    });
    stripeCustomerId = stripeCustomer.id;
    KnexUtil.updateUser({ slack_id: slackId }, { ...existingCustomer, stripe_id: stripeCustomerId });

    // new customer
    // if (!existingCustomer) {
    //   KnexUtil.createUser({
    //     email: email,
    //     data: {
    //       stripeId: stripeCustomer.id
    //     }
    //   });
    // connect existing customer to stripe
  } 

  return new Promise((resolve, reject) => {
    resolve(stripeCustomerId);
  });
}

export async function checkTeamAccess(ctx: Context) {
  if (ctx.isAuthenticated()) {
    const active = await KnexUtil.checkSubscriptionActive(ctx.state.user.team_id);
    if (active) {
      console.log("User already subscribed.")
      ctx.redirect('/user');
    } else {
      try {
        processSubscription(ctx);
        ctx.type = "html";
        ctx.body = renderToStaticMarkup(Payment(ctx));
      } catch(err) {
        console.log(err);
      }
    }
  } else {
    ctx.redirect('/');
  }
}

// export async function post(ctx: Context) {
//   const body = ctx.request.body;
//   const stripeCustomerId = await createOrFindStripeCustomer(body.slackId, body.teamId, body.stripeEmail, body.stripeToken);
//   const charge = await stripe.charges.create({
//     amount: 1000,
//     currency: 'usd',
//     customer: stripeCustomerId,
//     description: 'Example charge',
//     receipt_email: body.stripeEmail
//   });

//   ctx.type = "html";
//   ctx.body = renderToStaticMarkup(Payment(ctx));
// }

export async function processSubscription(ctx: Context) {
  const body = ctx.request.body;
  try {
    const stripeCustomerId = await createOrFindStripeCustomer(body.slackId, body.teamId, body.stripeEmail, body.stripeToken);
    stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{
        plan: "plan_DRTIXL0oJKRrmV"
      }
      ]
    }, async function (err: any, subscription: any) {
      if (err) {
        console.log(err);
      } else {
        const slackUser = await KnexUtil.fetchSlackUser('team_id', body.teamId);
        const update = {
          team_id: body.teamId,
          paid_by_id: body.slackId,
          subscription_id: subscription.id,
          subscription_data: {
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end
          }
        };
        if (!slackUser) {
          KnexUtil.createSlackUser(update);
        } else {
          KnexUtil.updateSlackUser({ team_id: body.teamId }, update);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
}
