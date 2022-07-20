const knexConfig = require("../data/knexfile");
const knex = require("knex");

const db = knex(knexConfig["development"]);

module.exports = db;
