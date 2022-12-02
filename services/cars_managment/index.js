'use strict';

import got from 'got';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const HOST = '0.0.0.0';

let active_cars = [];
let nextCarIndex = 0;


app.post('/register/:carNr', async (req, res) => {
  const carNr = req.params.carNr;
  const key = req.body.key;
  //console.log(key);
  //console.log("register");

  active_cars.push({carNr: carNr, key : key})
  //console.log(active_cars)

  res.status(200).send();
});

app.delete('/deregister/:carNr', async (req, res) => {
  //console.log("deregister");
  let carNR = req.params.carNr;

  const index = active_cars.map( e => e.carNr).indexOf(carNR);
  //console.log(index);

  if (index > -1) {         // only splice array when item is found
    active_cars.splice(index, 1); // 2nd parameter means remove one item only

    if(index <= nextCarIndex && nextCarIndex > 0) {
      nextCarIndex--;
    }
  }
  //console.log("Active cars after deregister")
  //console.log(active_cars)
  //ToDo remove from DB
  res.status(200).send();
});


//const manage_cars = () => {
//  if (active_cars.length > 0) {
//    console.log(active_cars[nextCarIndex])
//    got("http://speed-controller:5000/" + active_cars[nextCarIndex].ip);
//  }
//  if (active_cars.length > nextCarIndex + 1) {
//    nextCarIndex++;
//  } else {
//    nextCarIndex = 0;
//  }
//  
//}
const getKeyToNumber = (number) => {
  const index = active_cars.map( e => e.key).indexOf(number);
  return active_cars[index].key;
}

app.post('/decodeJWT/:number', async (req, res) => {
  console.log("JWT check");

  let number = req.params.number;
  let token = req.body.jwt;
  console.log(token);
  console.log(getKeyToNumber(number));

  var decoded = jwt.verify(token, getKeyToNumber(number));
  console.log(decoded)

  res.status(200).send(decoded);
});

app.post('/createJWT/:number', async (req, res) => {
  console.log("JWT creation");
  let number = req.params.number;
  let data = {
    speed: req.body.speed
  }
  

  var token = jwt.sign(data, getKeyToNumber(number));

  //ToDo check challenge
  res.status(200).send({jwt: token});
});

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});

//setInterval(manage_cars, 100) //every 100ms 1 car -> Not for production
 





