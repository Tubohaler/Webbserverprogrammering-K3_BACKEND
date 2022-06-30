/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    { id: 1, name: "Mark", message: "korv i skon" },
    { id: 2, name: "Frippe", message: "luft i byxorna" },
    { id: 3, name: "Waldorf", message: "finger i ögat" },
  ]);
};
