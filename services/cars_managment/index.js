'use strict';

import got from 'got';
import express from 'express';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const HOST = '0.0.0.0';

let active_cars = [];
let nextCarIndex = 0;


app.get('/register/:carNr', async (req, res) => {
  const carNr = req.params.carNr;
  console.log("register");
  //const id = req.body.id;


  active_cars.push({carNr: carNr, ip : "test"})
  console.log(active_cars)

  res.status(200).send();
});

app.get('/deregister/:carNr', async (req, res) => {
  console.log("deregister");
  let carNR = req.params.carNr;

  const index = active_cars.map( e => e.carNr).indexOf(carNR);
  console.log(index);

  if (index > -1) {         // only splice array when item is found
    active_cars.splice(index, 1); // 2nd parameter means remove one item only

    if(index <= nextCarIndex && nextCarIndex > 0) {
      nextCarIndex--;
    }
  }
  console.log("Active cars after deregister")
  console.log(active_cars)
  res.status(200).send();
});


const manage_cars = () => {
  if (active_cars.length > 0) {
    console.log(active_cars[nextCarIndex])
    got("http://speed-controller:5000/" + active_cars[nextCarIndex].ip);
  }
  if (active_cars.length > nextCarIndex + 1) {
    nextCarIndex++;
  } else {
    nextCarIndex = 0;
  }
  
}

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});

setInterval(manage_cars, 100) //every 100ms 1 car -> Not for production
 





