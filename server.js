'use strict';

const express = require('express');
require ('dotenv').config();
require('ejs');
const superagent = require('superagent');
const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {console.log(`turned up on ${PORT}`)});
