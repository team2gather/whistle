const knex = require('./knex.js');
const moment = require('moment');
moment().format();

// this needs to be severely refactored...

export function createUser(obj) {
  return knex('users').insert(obj).then();
};

export function createSlackUser(obj) {
  return knex('slack').insert(obj).then();
};

export function updateUser(where, data) {
  return knex('users').where(where).update(data).then();
}

export function updateSlackUser(where, data) {
  return knex('slack').where(where).update(data).then();
}

export async function checkSubscriptionActive(email) {
  const results = await fetchUserByEmail(email);
  const existingCustomer = results ? results.data : null;
  const slackTeamId = existingCustomer.teamId;

  const slackUser = await fetchSlackUser('teamId', slackTeamId);
  
  return new Promise((resolve, reject) => {
    if (slackUser) {
      const periodEndDate = moment.unix(slackUser.data.subscription.periodEnd);
      const bufferedDate = periodEndDate.add(2, 'days');
      if (moment().isBefore(bufferedDate)) {
        resolve(true);
      } else {
        resolve(false);
      }
    } else {
      resolve(false);
    }
  });
}

export function fetchSlackUser(key, value) {
  return new Promise((resolve, reject) => {
    knex('slack').where(key, value).then((rows) => {
      resolve(rows[0]);
    }).catch((err) => {
      reject({});
    });
  });
};

export function fetchUserByEmail(value) {
  return fetchUser('email', value);
};

export function fetchUserByGoogleId(value) {
  return fetchUser('google_id', value);
};

export function fetchUser(key, value) {
  return new Promise((resolve, reject) => {
    knex('users').where(key, value).then((rows) => {
      resolve(rows[0]);
    }).catch((err) => {
      reject({});
    });
  });
};