
exports.up = function(knex, Promise) {
  return knex.schema.createTable('slack', function(table) {
    table.increments('id').primary();
    table.string('team_id');
    table.string('paid_by_id');
    table.string('subscription_id');
    table.json('subscription_data');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('slack');
};
