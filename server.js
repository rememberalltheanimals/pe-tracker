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
      const countSql = "SELECT * FROM counts ORDER By id ASC;";
      const counts = await client.query(countSql);

      const args = {
        "counts": counts ? counts.rows : null
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
      const insertPraiseSql = `INSERT INTO counts (praise_counts)
        VALUES ('praise')`;

      const insertCriticizeSql = `INSERT INTO counts (criticize_counts)
        VALUES ('criticize')`;

      const praise_insert = await client.query(insertPraiseSql, [id]);
      const praise_select = await client.query(praise_selectSql);

      const criticize_insert = await client.query(insertCriticizeSql, [id]);
      const criticize_select = await client.query(criticize_selectSql);

      const praise_response = {
        newId: praise_insert ? praise_insert.rows[0] : null,
        when: praise_select ? praise_select.rows[0] : null
      };
      res.json(praise_response);
      client.release();

      const criticize_response = {
        newId: criticize_insert ? criticize_insert.rows[0] : null,
        when: criticize_select ? criticize_select.rows[0] : null
      };
      res.json(criticize_response);
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

