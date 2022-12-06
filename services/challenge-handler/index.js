'use strict';

import express from 'express';
import jwt from 'jsonwebtoken';

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;
const HOST = '0.0.0.0';

let active_drones = [];
let nextDroneIndex = 0;


app.post('/register/:droneID', async (req, res) => {
  const droneID = req.params.DroneId;
  const key = req.body.key;

  active_drones.push({droneID: droneID, key : key})

  res.status(200).send();
});

app.delete('/deregister/:droneID', async (req, res) => {
  let droneID = req.params.droneID;

  const index = active_drones.map( e => e.droneID).indexOf(droneID);

  if (index > -1) {                 // only splice array when item is found
    active_drones.splice(index, 1); // 2nd parameter means remove one item only

    if(index <= nextDroneIndex && nextDroneIndex > 0) {
      nextDroneIndex--;
    }
  }
  //ToDo remove from DB
  res.status(200).send();
});


const getKeyToNumber = (number) => {
  const index = active_drones.map( e => e.key).indexOf(number);
  return active_drones[index].key;
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

 





