'use strict';

import express from 'express';
const app = express()


// Constants
const PORT = 8080;
const HOST = '0.0.0.0';


app.get('/', async (req, res) => {
  res.send("Be nice");
});

app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
 





