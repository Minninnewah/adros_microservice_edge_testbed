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


app.get('/', async (req, res) => {
  console.log("test");
  const data = await got(speed_analysis).json();
  res.status(200).json(data);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 