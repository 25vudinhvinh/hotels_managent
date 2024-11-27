const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')
const pg = require('./config/pg')
const {getCoordinates} = require('./config/pg')


// morgan log 
const morgan = require('morgan')
app.use(morgan('combined'))

// template engine ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// middleware file tinh
app.use(express.static(path.join(__dirname, 'public')));


// route
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});
// api cho location
app.get('/api', async(req, res) =>{
	try{
		const coordinates = await getCoordinates()
		res.json(coordinates)
	}catch(error){
		console.error(error)
		res.status(500).send('Error retrieving coordinates');
	}
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
