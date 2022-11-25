'use strict';

import got from 'got';
import express from 'express';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let active_cars = {};
const CAR_PORT = 3000;
const NUMBER_LENGTH = 7;
const DEFAULT_SPEED = 120;

const PORT = 8080;
const HOST = '0.0.0.0';


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




app.get('/', async (req, res) => {
  res.status(200).json({ speed: speed, position: position, distance: distance});
});

app.post('/', async (req, res) => {
  
  console.log("register car");
  

  res.status(200).send();
});

app.listen(PORT, HOST, () => {
    console.log(`API ist listening`);
});
 
const register = () => {
  got(blub).json();
}

register();


