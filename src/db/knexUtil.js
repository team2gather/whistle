const knex = require('./knex.js');
const moment = require('moment');
moment().format();

// this needs to be severely refactored...
const userTable = 'user';
const slackTable = 'slack';

export function createUser(obj) {
  return knex(userTable).insert(obj).then();
};

export function createSlackUser(obj) {
  return knex(slackTable).insert(obj).then();
};

export function updateUser(where, data) {
  return knex(userTable).where(where).update(data).then();
}

export function updateSlackUser(where, data) {
  return knex(slackTable).where(where).update(data).then();
}

export async function checkSubscriptionActive(teamId) {
  if (!teamId)
    return false;
  const slackUser = await fetchSlackUser('team_id', teamId);
  return new Promise((resolve, reject) => {
    if (slackUser) {
      const periodEndDate = moment.unix(slackUser.subscription_data.current_period_end);
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
    knex(slackTable).where(key, value).then((rows) => {
      resolve(rows[0]);
    }).catch((err) => {
      console.log(err);
      reject({});
    });
  });
};

// export function fetchUserByEmail(value) {
//   return fetchUser('email', value);
// };

// export function fetchUserByGoogleId(value) {
//   return fetchUser('google_id', value);
// };

export function fetchUser(key, value) {
  return new Promise((resolve, reject) => {
    knex(userTable).where(key, value).then((rows) => {
      resolve(rows[0]);
    }).catch((err) => {
      reject({});
    });
  });
};