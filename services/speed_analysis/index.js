'use strict';

import got from 'got';
import express from 'express';
const app = express()


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const db_handler_url = 'http://cloud-db-handler:5000/cars';

const nrSplits = 100;
const roadLength = 3000;
const defaultRoadSpeed = 120;


app.get('/', async (req, res) => {
  console.log("test");
  const data = await got(db_handler_url).json();

  let roadPieces = new Array(nrSplits).fill(defaultRoadSpeed);

  data.forEach(el => {

    let arrayPos = Math.floor(el.position/(roadLength/nrSplits));
    console.log(arrayPos);
    if(roadPieces[arrayPos] == defaultRoadSpeed){
      roadPieces[arrayPos] = el.speed;
    }
    
  });
  //console.log(data)
  //console.log(typeof data);
  //console.log(data[0]);
  //console.log("test2");
  //console.log(data)
  //Create speed analysis
  res.status(200).json(roadPieces);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 





