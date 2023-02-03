'use strict';

import express from 'express';
const app = express()


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

let value = 0;


app.get('/', async (req, res) => {
  value++;
  value = value % 10000;
  res.send("Request: " + value);
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 





