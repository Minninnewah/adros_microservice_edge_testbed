'use strict';

import got from 'got';
import express from 'express';
const app = express()


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const db_handler_url = 'http://cloud-db-handler:5000/drones';


app.get('/', async (req, res) => {
  const data = await got(db_handler_url).json();

  let drones = {};

  data.forEach(el => {
    console.log(el.timestamp)
    console.log(typeof el.timestamp)

    if(drones[el.number] == undefined) {
      drones[el.number] = [el.position, el.timestamp]
    }
    else{
      if(el.timestamp > drones[el.number][1]){
        drones[el.number] = [el.position, el.timestamp]
      }
    }

    
  });

  let positions = new Array(Object.keys(drones).length);

  Object.values(drones).forEach((el, index) => {
    positions[index] = el[0];
  })

  res.status(200).json(positions);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 





