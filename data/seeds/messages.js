/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("messages").del();
  await knex("messages").insert([
    { user_id: "Toffel", message: "sover du?", room_id: "Kyrktornet" },
    {
      user_id: "Muffin",
      message: "Ska vi ses för en öl?",
      room_id: "Tortyraaaa",
    },
    { user_id: "Smörpåse", message: "Såg du på tv?", room_id: "Caste" },
  ]);
};
