const path = require('path');
const BASE_PATH = '../db';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://postgres:@localhost:5432/team2gather-dev',
    migrations: {
      directory: path.join(BASE_PATH, 'migrations')
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds')
    }
  }
};