const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const formidable = require('express-formidable');
const db = require('./config/db');
const path = require('path');
const cors = require('cors');
const events = require('events');
const index = require('./app/routes/index.js');

// events.EventEmitter.defaultMaxListeners = Infinity;

const app = express();

app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.header('Access-Control-Allow-Origin', '*');

	// Request methods you wish to allow
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.header('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use(formidable({
	uploadDir: 'upload/',
	keepExtensions: true
}));

app.set('port', (process.env.PORT || 8001));

MongoClient.connect(db.url, (err, database) => {

	if (err) {
		return console.log(err)
	}

	index(app, database);

	app.listen(app.get('port'), () => {
		console.log('We are live on ' + app.get('port'));
	});
});
