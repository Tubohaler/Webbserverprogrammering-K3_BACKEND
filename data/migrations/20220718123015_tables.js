/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name").unique().notNullable();
  });

  await knex.schema.createTable("messages", (table) => {
    // Skapar en kolumn "id" som "auto incrementar" id't
    table.increments("id");
    // Skapar en kolumn "name" som inte kan vara null
    table.string("user_id").notNullable();
    // Skapar en kolumn "email" som måste vara unique och inte null
    table.string("message").notNullable();

    table.string("room_id").notNullable();
    // En kolumn som skapar en timestamp när en användare skapas
    table.timestamps(true, true);
  });

  await knex.schema.createTable("rooms", (table) => {
    // Skapar en kolumn "id" som "auto incrementar" id't
    table.increments("id");
    // Skapar en kolumn "name" som inte kan vara null
    table.string("name").unique().notNullable();
    // Skapar en kolumn "email" som måste vara unique och inte null
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return (
    knex.schema
      // .dropTableIfExists("users")
      // .dropTableIfExists("messages")
      .dropTableIfExists("rooms")
  );
};
