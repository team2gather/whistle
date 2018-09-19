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
      let charges = [];
      if (ctx.state.stripe_id) {
        charges = await stripe.charges.list({ 
          customer: ctx.state.user.stripe_id,
          limit: 100, // 0 - 100 (need pagination w/ starting after to display more)
        });
      } 
      
      ctx.type = "html";
      ctx.body = renderToStaticMarkup(User(ctx, {
          slackId: ctx.state.user.slack_id,
          teamId: ctx.state.user.team_id,
          email: ctx.state.user.email,
          subscriptionActive: await checkSubscriptionActive(ctx.state.user.team_id),
          transactions: charges
        }));
    } else {
      ctx.redirect('/');
    }
  } catch (err) {
    console.log(err)
  }
}