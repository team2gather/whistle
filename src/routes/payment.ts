import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { Payment } from "../views/payment";

const dotenv: any = require("dotenv");
dotenv.config();
var stripe = require("stripe")(process.env.STRIPE_TEST_SEC_KEY);

export async function get(ctx: Context) {
  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}

// { stripeToken: 'tok_1CyrEYHkmOXvmkndbdkcnj39',
//   stripeTokenType: 'card',
//   stripeEmail: 'djfalkjdfjal@djfalfjdl.com' }

export async function post(ctx: Context) {
  console.log("POST!!!");
  const body =  ctx.request.body;
  console.log(body);
  

  // search for customer in DB
  // if exists, grab customer id.
  // skip create
  const customer = await stripe.customers.create({
    source: body.stripeToken,
    email: body.stripeEmail,
  });
  // store customer in DB

  const charge = await stripe.charges.create({
    amount: 1000,
    currency: 'usd',
    customer: customer.id,
    description: 'Example charge',
    // receipt_email: 'blah'
  });

  ctx.type = "html";
  ctx.body = renderToStaticMarkup(Payment(ctx));
}
