
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table) {
    table.increments('id').primary();
    table.string('email');
    table.string('slack_id');
    table.string('team_id');
    table.string('stripe_id');
    table.json('user_data');
    table.json('team_data');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
