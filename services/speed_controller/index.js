'use strict';

import got from 'got';
import express from 'express';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let active_cars = {};
const CAR_PORT = 3000;
const edge_db_handler = "http://edge-db-handler:5000"
const speedIncrease = 1;
const speedSlowDecrease = 1;
const speedFastDecrease = 2;
const MAX_SPEED = 120;

const PORT = 8080;
const HOST = '0.0.0.0';

const increaseSpeed = function (speed) {
  return Math.max(speed + speedIncrease, MAX_SPEED);
}

const decreaseSpeedSlow = function (speed) {
  return Math.min(speed - speedSlowDecrease, MAX_SPEED);
}

const decreaseSpeedFast = function (speed) {
  return Math.min(speed - speedFastDecrease, MAX_SPEED);
}

app.get('/:ip', async (req, res) => {
  console.log("Speed controlling for: " + req.params.ip);
  const ip = req.params.ip;

  //ToDo
  //const data = await got(ip + ":" + CAR_PORT).json();
  const data = {speed : 20, position: 400, distance: 100};

  let speed = data.speed;
  console.log(edge_db_handler + "/nextCar/" + data.position)
  
  const carBefore = await got(edge_db_handler + "/nextCar/" + data.position).json();
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

  //ToDo
  //got(edge_db_handler + "/nextCar/" + data.position);

  //store received values to the db

  //ToDo set speed to car
  console.log(speed)

  res.status(200).send("Speed:" + speed);
});

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});
 





