require("dotenv").config(); // Read environment variables from .env

const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5163;
const { Pool } = require("pg");

const pool = new Pool({
 connectionString: process.env.DATABASE_URL, 
 ssl: {
  rejectUnauthorized: false
  }
});

express()
 .use(express.static(path.join(__dirname, "public")))
 .use(express.json())
 .use(express.urlencoded({ extended: true }))
 .set("views", path.join(__dirname, "views"))
 .set("view engine", "ejs")
 .get("/", async(req, res) => {
    try {
      const client = await pool.connect();
      const praiseSql = "SELECT praise_counts FROM counts;";
      const criticizeSql = "SELECT criticize_counts FROM counts;";

      const praise_counts = await client.query(praiseSql);
      const criticize_counts = await client.query(criticizeSql);

      const args = {
        praise_counts: praise_counts ? praise_counts.rows : null,
        criticize_counts: criticize_counts ? criticize_counts.rows : null
      };
      
      res.render("pages/index", args); 
      
    } 
    catch (err) {
      console.error(err);
      res.set({
      "Content-Type": "application/json"
      });
      res.json({
      error: err
      });
    }
  })
 .post("/log", async(req, res) => {
    res.set({
      "Content-Type": "application/json"
    });

    try {
      const client = await pool.connect();
      const id = req.body.id;
      const insertPraiseSql = `UPDATE counts SET praise_counts = praise_counts +1;`;

      const insertCriticizeSql = `UPDATE counts SET criticize_counts = criticize_counts +1;`;

      const praise_insert = await client.query(insertPraiseSql);

      const criticize_insert = await client.query(insertCriticizeSql);

      const praise_response = {
        newCount: praise_insert ? praise_insert.rows[0] : null
      };
      res.json(praise_response);
      client.release();

    }
    catch (err) {
      console.error(err);
      res.json({
        error: err
      });
    }
  })
 .listen(PORT, () => console.log(`Listening on ${PORT}`));

