import * as Home from './routes/home';
import Router from 'koa-router';

type Route = (router: Router) => Promise<void>;

const home: Route = async (router) => {
  router.get('/', Home.get)
};

export default [
  home
];
