// for specifying relative/absoulte path using Node.js built-in module
const path = require('path');

// Express route handlers
const express = require('express');
const bodyParser = require('body-parser');

const publicPath = path.join(__dirname, '../public');

var app = express();

// Heroku ready 
const port = process.env.PORT || 3000;

// Express static middleware configuration
app.use(express.static(publicPath));

app.listen(port, () => {
	console.log(`***Started up at ${port}`);
});