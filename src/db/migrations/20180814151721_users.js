
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('email');
    table.json('data');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
