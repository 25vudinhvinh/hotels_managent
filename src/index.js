const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')
const pg = require('./config/pg')


pg
	.connect()
	.then(() => {
		console.log('Connected to PostgreSQL database');
	})
	.catch((err) => {
		console.error('Error connecting to PostgreSQL database', err);
	});


// morgan log 
const morgan = require('morgan')
app.use(morgan('combined'))

// template engine ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// middleware file tinh
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
