/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("rooms").del();
  await knex("rooms").insert([
    { name: "Cukel" },
    { name: "Masten" },
    { name: "Såbb" },
  ]);
};
