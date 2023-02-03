'use strict';

import express from 'express';
import pg from 'pg';
import got from 'got';
const Client = pg.Client
const { Pool } = pg


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new Client()

const pool = new Pool({
    user: 'admin',
    host: 'edge-db',
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
        54004568,
        15,
        5,
        600
      ),
      (
        $2,
        54004567,
        30,
        30,
        500
      );`;

const insertDroneQuery = `INSERT INTO drones (timestamp, number, speed, distance, position) 
  SELECT 
    $1,
    $2, 
    $3,
    $4,
    $5
  WHERE NOT EXISTS (SELECT number FROM drones WHERE number=$6);`

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
}

function uploadDataToCloudCluster (timestamp, number, speed, distance, position) {
  //ToDo upload & replace cluster intern dns name
  console.log("Received")
  console.log(number)

  got.post('http://cloud-db-handler:5000', {
    json: {
      timestamp: timestamp,
      speed: speed,
      distance: distance,
      position: position,
      number: number
    }
  })

}

function get_drone (req, res) {
  //res.send('Hello World');
  const SQL_SELECT_COMMAND = 'SELECT * FROM drones WHERE number = $1';
  pool.query(SQL_SELECT_COMMAND, [req.params.number], (err, res2) => {
    if (err) {
      throw err
    }
    if(res2.rows.length == 0) {
      res.status(200).send("Data does not exist.");
    }
    res.status(200).send(res2.rows[0])
  })
}

function get_drone_before (req, res) {
  const SQL_SELECT_DRONE_BEFORE_COMMAND = 'SELECT * FROM drones WHERE position > $1 ORDER BY position LIMIT 1';
  pool.query(SQL_SELECT_DRONE_BEFORE_COMMAND, [req.params.position], (err, res2) => {
    if (err) {
      throw err
    }
    if(res2.rows.length == 0) {
      res.status(200).send([]);
    }
    res.status(200).send(res2.rows[0])
  })
}

function update_drone (req, res) {
  const SQL_UPDATE_COMMAND = "UPDATE drones SET timestamp = $1, speed=$2, distance=$3, position=$4 WHERE number=$5;"

  let currentTimestamp = new Date();

  //Update does nothing if not already exist and insert has "where not exist" part so it only insert the data if not already exist => it's an XOR
  pool.query(SQL_UPDATE_COMMAND, [currentTimestamp, req.body.speed, req.body.distance, req.body.position, req.body.number], (err, res2) => {
    if (err) {
      throw err
    }
    pool.query(insertDroneQuery, [currentTimestamp, req.body.number, req.body.speed, req.body.distance, req.body.position, req.body.number], (err, res2) => {
      if (err) {
        throw err
      }

      //If no error occurs we should reach this point no matter if update or insert is used
      uploadDataToCloudCluster(currentTimestamp, req.body.number, req.body.speed, req.body.distance, req.body.position)
      res.status(200).send();
    })
  })
}

function delete_drone (req, res) {
    const SQL_DELETE_COMMAND = "DELETE FROM drones WHERE number=$1;"
    pool.query(SQL_DELETE_COMMAND, [req.params.number], (err, res2) => {
      if (err) {
        throw err
      }
      res.status(200).send();
    })
}

await init_db();

app.get('/:number',get_drone);
app.put('/', update_drone);
app.delete('/:number', delete_drone)
app.get('/nextDrone/:position',get_drone_before);
  
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});






