import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Payment } from "../views/payment";
import * as KnexUtil from '../db/knexUtil.js'; 

var moment = require('moment');
moment().format();

const dotenv: any = require("dotenv");
dotenv.config();
var stripe = require("stripe")(process.env.STRIPE_TEST_SEC_KEY);

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}

async function upsertUser(email:string, token:string) {
  const results = await KnexUtil.fetchUserByEmail(email);
  const existingCustomer = results ? results.data : null;
  var stripeCustomerId = existingCustomer ? existingCustomer.stripeId : '';

  // not connected to stripe
  if (!existingCustomer || !stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      source: token,
      email: email,
    });
    // new customer
    if (!existingCustomer) {
      KnexUtil.createUser({
        email: email,
        data: {
          stripeId: stripeCustomer.id
        }
      });
    // connect existing customer to stripe
    } else if (!stripeCustomerId) {
      const update = {...existingCustomer.data};
      update.stripeId = stripeCustomer.id
      KnexUtil.updateUser({email: email}, {data: update});
    }
  } 

  return new Promise((resolve, reject) => {
    resolve(stripeCustomerId);
  });
}

export async function checkAccess(ctx: Context) {
  if (ctx.isAuthenticated()) {
    const active = await KnexUtil.checkSubscriptionActive(ctx.state.user.email);
    console.log("User already subscribed.")
    ctx.redirect('/user');
  } else {
    processSubscription(ctx);
  }
}

export async function post(ctx: Context) {
  const body =  ctx.request.body;
  const stripeCustomerId = await upsertUser(body.stripeEmail, body.stripeToken);
  const charge = await stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    customer: stripeCustomerId,
    description: 'Example charge',
    receipt_email: body.stripeEmail
  });

  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}

export async function processSubscription(ctx: Context) {
  const body =  ctx.request.body;
  if (KnexUtil.checkSubscriptionActive(body.stripeEmail)) {
    //do nothing
  } else {
    const stripeCustomerId = await upsertUser(body.stripeEmail, body.stripeToken);
    try {
      stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{
            plan: "plan_DRTIXL0oJKRrmV"
          },
        ]}, async function(err:any, subscription:any) {
          if (err) {
            console.log('error! ', err); 
          } else {
            const results = await KnexUtil.fetchUserByEmail(body.stripeEmail);
            const existingCustomer = results ? results.data : null;
            const slackTeamId = existingCustomer.teamId;
          
            const slackUser = await KnexUtil.fetchSlackUser('teamId', slackTeamId);
            const update = {
              email: body.stripeEmail,
              teamId: slackTeamId,
              data: {
                subscription: {
                  periodStart: subscription.current_period_start,
                  periodEnd: subscription.current_period_end
                }
              }
            };
            if (!slackUser) {
              KnexUtil.createSlackUser(update);
            } else {
              KnexUtil.updateSlackUser({email: body.stripeEmail}, {data: update});
            }
          }
        });
    } catch(err) {
      console.log('error!', err);
    }
  }

  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}
