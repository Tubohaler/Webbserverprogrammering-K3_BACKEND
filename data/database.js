const knexConfig = require("../data/knexfile");
const knex = require("../data/knexfile");

const db = knex(knexConfig["development"]);

module.exports = db;
