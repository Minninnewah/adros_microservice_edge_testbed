'use strict';

const express = require('express')
const { Client } = require('pg')
const { Pool } = require('pg')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client()
const pool = new Pool({
    user: 'admin',
    host: 'cloud-db',
    database: 'admin',
    password: 'admin',
    port: 5432,
  })

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const now = new Date();

const createTable = `
    CREATE TABLE IF NOT EXISTS "drones" (
	    "id" SERIAL,
	    "timestamp" TIMESTAMP NOT NULL,
      "number" VARCHAR(10) NOT NULL,
	    "speed" REAL NOT NULL,
      "distance" REAL NOT NULL,
      "position" REAL NOT NULL,
	    PRIMARY KEY ("id")
    );`;

const insertSampleData = `
    INSERT INTO drones (timestamp, number, speed, distance, position)
    VALUES (
        $1,
        54004566,
        10,
        10,
        300
      ), 
      (
        $2,
        54004567,
        20,
        30,
        500
      );`;

const insertDroneQuery = `INSERT INTO drones (timestamp, number, speed, distance, position) 
  VALUES (
    $1,
    $2, 
    $3,
    $4,
    $5
  );`

async function init_db() {
  let db_available = false;
  while (db_available == false){
    try {
      console.log("test1")
      await pool.query(`DROP TABLE IF EXISTS drones;`)
      console.log("test2")
      await pool.query(createTable);
      console.log("test3")
      await pool.query(insertSampleData, [now, now]);
      console.log("test4")
      db_available = true;
    } catch (err) {
      console.log("DB not yet available")
      console.log(err)
    }
  }
  console.log("Init done 2")
}

function add_drone_data(req, res) {
  console.log("Nice")
  //console.log(req)
  console.log(req.body)
  console.log(req.body.number)
  pool.query(insertDroneQuery, [req.body.timestamp, req.body.number, req.body.speed, req.body.distance, req.body.position]);
  res.status(200).send();
}


async function get_Data_to_time(req, res) {
  const timestamp = new Date(); //now;
  const sqlCommand = `SELECT *
    FROM    drones 
    WHERE   timestamp BETWEEN $1::timestamp - (INTERVAL '15 second') AND $2::timestamp;`

  pool.query(sqlCommand, [timestamp, timestamp], (error, results) => {

    if(error) {
      throw error
    }
    res.status(200).json(results.rows);
  })
}


init_db();
console.log("Init done")

app.get('/', (req, res) => {
    //res.send('Hello World');
    pool.query('SELECT * FROM drones', (err, res2) => {
      if (err) {
        throw err
      }
      res.status(200).json(res2.rows)
    })
    
});

app.get('/drones', get_Data_to_time);
app.post('/', add_drone_data)
  
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});






