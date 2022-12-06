'use strict';

import got from 'got';
import express from 'express';
import jwt from 'jsonwebtoken';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const NUMBER_LENGTH = 7;
const DEFAULT_SPEED = 50;

const PORT = 8080;
const HOST = '0.0.0.0';

const dronesManagementService = "http://drones-management:5000/"
const speedControllerService = "http://speed-controller:5000/"


const getJWT = (data) => {
  return jwt.sign(data, number);
}

const randomNumber = () => {
  let number = "";
  for (let i = 0; i < NUMBER_LENGTH; i++){
    number += Math.floor(Math.random() * 10).toString();
  }
  return number;
}

let speed = DEFAULT_SPEED;
let position = 0;
let distance = 0;
let number = randomNumber();
let key = number // number as key is very weak!!!


app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});
 
const register = async () => {
  console.log("Try to register")
  await got.post(dronesManagementService + "register/" + number, {
    json: {
      key: key
    }
  });
  console.log("register done");
  inControlledSection = true;
}

const deregister = () => {
  got.delete(dronesManagementService + "deregister/" + number);
}

const getSpeed = async () => {
  let reqData = {
    speed: speed,
    distance: distance,
    position: position,
    number: number,
  }
  let token = getJWT(reqData);
  console.log("JWT");
  console.log(token);
  const data = await got.post(speedControllerService, {
    json: {
      number: number,
      jwt: token
    }
  }).json();

  console.log(data)
  try {
    let decoded = jwt.verify(data.jwt, number);
    return decoded.speed;
  } catch(err) {
    console.log("Invalid jwt");
    return NaN;
  }
  
}

let inControlledSection = true;

const controlLoop = async () => {
  if (inControlledSection) {
    console.log("Control loop")
    let newSpeed = await getSpeed()
    console.log(newSpeed);
    if (!isNaN(newSpeed)) {
      console.log("New speed is set")
      speed = newSpeed;
    }
    //Simulate position based on speed (In real it would come from a sensor)
    // 3km with 50km/h -> 3.6 minutes = 216s
    // 3000m / 216s = 13.88m/s = 13.88m/loop
    let distancePerLoop = 3000 / (3000 / speed * 3600)
    position += distancePerLoop;
    console.log(position);
    if(position >= 3000) {
      inControlledSection = false;
      deregister();
    }
  }
  else {
    //Create new drone nr etc and start from the beginning of the route
    position = 0;
    distance = 0;
    let number = randomNumber();
    key = number // number as key is very weak!!!
    register();
  }
}

await register();
setInterval(controlLoop, 1000) //every 1000ms 1 drone -> Not for production


