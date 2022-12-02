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
    CREATE TABLE IF NOT EXISTS "cars" (
	    "id" SERIAL,
	    "timestamp" TIMESTAMP NOT NULL,
      "number" VARCHAR(10) NOT NULL,
	    "speed" REAL NOT NULL,
      "distance" REAL NOT NULL,
      "position" REAL NOT NULL,
	    PRIMARY KEY ("id")
    );`;

const insertSampleData = `
    INSERT INTO cars (timestamp, number, speed, distance, position)
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

const insertCarQuery = `INSERT INTO cars (timestamp, number, speed, distance, position) 
  VALUES (
    $1,
    $2, 
    $3,
    $4,
    $5
  );`

async function init_db() {
  await pool.query(`DROP TABLE IF EXISTS cars;`)
  await pool.query(createTable);
  await pool.query(insertSampleData, [now, now]);
}

function add_car_data(req, res) {
  console.log("Nice")
  //console.log(req)
  console.log(req.body)
  console.log(req.body.number)
  pool.query(insertCarQuery, [req.body.timestamp, req.body.number, req.body.speed, req.body.distance, req.body.position]);
  res.status(200).send();
}


async function get_Data_to_time(req, res) {
  const timestamp = now;
  const sqlCommand = `SELECT *
    FROM    cars 
    WHERE   timestamp BETWEEN $1::timestamp - (INTERVAL '15 second') AND $2::timestamp;`

  pool.query(sqlCommand, [timestamp, timestamp], (error, results) => {

    if(error) {
      throw error
    }
    res.status(200).json(results.rows);
  })
}


init_db();

app.get('/', (req, res) => {
    //res.send('Hello World');
    pool.query('SELECT * FROM cars', (err, res2) => {
      if (err) {
        throw err
      }
      console.log('car:', res2.rows[0])
      res.status(200).json(res2.rows)
    })
    
});

app.get('/cars', get_Data_to_time);
app.post('/', add_car_data)
  
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});






