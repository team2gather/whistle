const knex = require('./knex.js');


// this needs to be severely refactored...

export function createUser(obj) {
  return knex('users').insert(obj).then();
};

export function updateUser(where, data) {
  return knex('users').where(where).update(data).then();
}

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