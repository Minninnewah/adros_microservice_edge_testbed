'use strict';

import got from 'got';
import express from 'express';
import cors from "cors";

const app = express()
app.use(cors())


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const speed_analysis = 'http://speed-analysis:5000';
const car_distribution = 'http://car-distribution:5000';


app.get('/speed-analysis', async (req, res) => {
  const data = await got(speed_analysis).json();
  res.status(200).json(data);
});

app.get('/car-distribution', async (req, res) => {
  const data = await got(car_distribution).json();
  res.status(200).json(data);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 