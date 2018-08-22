
exports.up = function(knex, Promise) {
  return knex.schema.createTable('slack', function(table) {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('teamId');
    table.string('email');
    table.json('data');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
