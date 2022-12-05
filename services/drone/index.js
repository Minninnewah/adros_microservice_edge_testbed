'use strict';

import got from 'got';
import express from 'express';
import jwt from 'jsonwebtoken';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const NUMBER_LENGTH = 7;
const DEFAULT_SPEED = 120;

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
let key = number //"test" //ToDo change to random


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
    //console.log(speed);
    //Add some position and speed management stuff
    position += 100;
    console.log(position);
    if(position >= 3000) {
      inControlledSection = false;
      deregister();
    }
  }
  else {
    //ToDo create new drone nr etc and start from the beginning
    register();
  }
}

await register();
setInterval(controlLoop, 1000) //every 100ms 1 drone -> Not for production


