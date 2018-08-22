import { Context } from "koa";
import { renderToStaticMarkup } from "react-dom/server";
import { User } from "../views/user";
import { checkSubscriptionActive } from '../db/knexUtil.js'; 

const dotenv: any = require("dotenv");
dotenv.config();
var stripe = require("stripe")(process.env.STRIPE_TEST_SEC_KEY);

// import {fetchUser} from '../db/knex.js';

export async function get(ctx: Context) {
  try {
    if (ctx.isAuthenticated()) {
      const charges = await stripe.charges.list({ 
        customer: ctx.state.user.stripeId,
        limit: 100, // 0 - 100 (need pagination w/ starting after to display more)
      });

      ctx.type = "html";
      ctx.body = renderToStaticMarkup(User(ctx, {
        email: ctx.state.user.email,
        subscriptionActive: await checkSubscriptionActive(ctx.state.user.email),
        transactions: charges.data
      }));
    } else {
      ctx.redirect('/');
    }
  } catch (err) {
    console.log(err)
  }
}