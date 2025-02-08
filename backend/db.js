const { Pool } = require("pg");
require("dotenv").config();

const databaseURL = "postgresql://dkr_cat_track_user:IhgpSZgjTdz98ABJpERvkeglUKMbOQAp@dpg-cuhcu3t6l47c73dp2lu0-a.oregon-postgres.render.com/dkr_cat_track";
console.log(`ENV: ${JSON.stringify(process.env, null, 2)}`);
console.log(`ENV: ${process.env.NODE_ENV}`);
const pool = new Pool({
  connectionString: databaseURL, // process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // : false,
});

module.exports = pool;
