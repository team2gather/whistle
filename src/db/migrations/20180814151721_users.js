
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('google_email');
    table.string('google_id');
    table.string('stripe_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
