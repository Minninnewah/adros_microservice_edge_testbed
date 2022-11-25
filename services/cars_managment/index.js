'use strict';

import got from 'got';
import express from 'express';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let active_cars = {};
let nextCarIndex = 0;


app.get('/register', async (req, res) => {
  console.log("register");
  const id = req.body.id;
  const ip = req.body.ip;


  active_cars[carNr] = req.ip + ":" + "3000"
  //req.connection.remoteAddress
  //req.connection.remotePort
  //req.connection.localAddress
  //req.connection.localPort
  //const data = await got(db_handler_url).json();

  res.status(200).json(roadPieces);
});

app.get('/deregister', async (req, res) => {
  console.log("deregister");
  let carNR = req.query.id;

  const index = active_cars.indexOf(carNR);
  if (index > -1) {         // only splice array when item is found
    active_cars.splice(index, 1); // 2nd parameter means remove one item only

    if(index <= nextCarIndex && nextCarIndex > 0) {
      nextCarIndex--;
    }
  }

  res.status(200).json(roadPieces);
});


const manage_cars = () => {
  if (active_cars.length() > 0) {
    got("speed-controller/" + active_cars[nextCarIndex]).json();
  }
  if (active_cars.length() > nextCarIndex + 1) {
    nextCarIndex++;
  } else {
    nextCarIndex = 0;
  }
  
}

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});

setInterval(manage_cars, 100) //every 100ms 1 car -> Not for production
 





