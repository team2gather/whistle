import * as Home from './routes/home';
import * as Payment from './routes/payment';
import Router from 'koa-router';

type Route = (router: Router) => Promise<void>;

const home: Route = async (router) => {
  router.get('/', Home.get)
};

const payment: Route = async (router) => {
  router.get('/payment', Payment.get),
  router.post('/processPayment', Payment.post)
};

export default [
  home,
  payment
];
