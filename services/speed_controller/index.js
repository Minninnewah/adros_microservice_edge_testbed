'use strict';

import got from 'got';
import express from 'express';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let active_cars = {};
const CAR_PORT = 3000;
const edge_db_handler = "http://edge-db-handler:5000/"
const cars_management = "http://cars-management:5000/"
const speedIncrease = 1;
const speedSlowDecrease = 1;
const speedFastDecrease = 2;
const MAX_SPEED = 120;

const PORT = 8080;
const HOST = '0.0.0.0';

const increaseSpeed = function (speed) {
  return Math.min(speed + speedIncrease, MAX_SPEED);
}

const decreaseSpeedSlow = function (speed) {
  return Math.max(speed - speedSlowDecrease, 0);
}

const decreaseSpeedFast = function (speed) {
  return Math.max(speed - speedFastDecrease, 0);
}

app.post('/', async (req, res) => {

  const number = req.body.number;
  const jwt = req.body.jwt;
  console.log(jwt);

  const data = await got.post(cars_management + 'decodeJWT/' + number, {
    json: {
      jwt: jwt
    }
  }).json();
  console.log(data)  
  
  //const data = {
  //  speed: req.body.speed,
  //  distance: req.body.distance,
  //  position: req.body.position,
  //  number: req.body.number
  //}

  //ToDo
  //const data = await got(ip + ":" + CAR_PORT).json();
  //const data = {speed : 20, position: 400, distance: 100, number: 666};

  let speed = data.speed;
  console.log(edge_db_handler + "nextCar/" + data.position)
  
  const carBefore = await got(edge_db_handler + "nextCar/" + data.position).json();
  console.log(carBefore)

  if(carBefore.length == 0) {
    speed = increaseSpeed(speed);
  }
  else if(data.position < carBefore.position + 100)
    if(data.distance > 60){
      //Slow changes toward the speed of the car before
      if (speed < carBefore.speed) {
        speed = increaseSpeed(speed);
      } 
      else if (speed > carBefore.speed) {
        speed = decreaseSpeedSlow(speed);
      }
    }
    else if (data.distance > 40 && carBefore.speed-speed < 5 ) {
      speed = decreaseSpeedSlow(speed);
    }
    else{
      if (carBefore.speed > speed) {
        speed = decreaseSpeedSlow(speed);
      }
      else {
        speed = decreaseSpeedFast(speed);
      }
    }
  else{
    //street is free to speed up to the max
    speed = increaseSpeed(speed);
  }

  //store received values to the db
  got.put(edge_db_handler, {
    json: {
      speed: speed,
      distance: data.distance,
      position: data.position,
      number: data.number
    }
  })

  console.log(speed)
  //let speed2 = speed;

  const responseJwt = await got.post(cars_management + 'createJWT/' + number, {
    json: {
      speed: speed
    }
  }).json()
  console.log("Repsonse JWT");
  console.log(responseJwt)
  res.status(200).send(responseJwt);
});

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});
 





