'use strict';

import got from 'got';
import express from 'express';
import cors from "cors";

const app = express()
app.use(cors())


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const db_handler_url = 'http://cloud-db-handler:5000/drones';

const nrSplits = 100;
const routeLength = 3000;
const defaultRouteSpeed = 120;


app.get('/', async (req, res) => {
  console.log("test");
  const data = await got(db_handler_url).json();

  let roadPieces = new Array(nrSplits).fill(defaultRouteSpeed);

  data.forEach(el => {

    let arrayPos = Math.floor(el.position/(routeLength/nrSplits));
    console.log(arrayPos);
    if(roadPieces[arrayPos] == defaultRouteSpeed){
      roadPieces[arrayPos] = el.speed;
    }
    
  });

  res.status(200).json(roadPieces);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 





