import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Payment } from "../views/payment";
import { fetchUserByEmail, createUser, updateUser } from '../db/knexUtil.js'; 

const dotenv: any = require("dotenv");
dotenv.config();
var stripe = require("stripe")(process.env.STRIPE_TEST_SEC_KEY);

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}

export async function post(ctx: Context) {
  const body =  ctx.request.body;

  const results = await fetchUserByEmail(body.stripeEmail);
  const existingCustomer = results ? results.data : null;
  var stripeCustomerId = existingCustomer ? existingCustomer.stripeId : '';

  // not connected to stripe
  if (!existingCustomer || !stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      source: body.stripeToken,
      email: body.stripeEmail,
    });
    // new customer
    if (!existingCustomer) {
      createUser({
        email: body.stripeEmail,
        data: {
          stripeId: stripeCustomer.id
        }
      });
    // connect existing customer to stripe
    } else if (!stripeCustomerId) {
      const update = {...existingCustomer.data};
      update.stripeId = stripeCustomer.id
      updateUser({email: body.stripeEmail}, {data: update});
    }
    stripeCustomerId = stripeCustomer.id;
  } 

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
