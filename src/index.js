const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')
const pg = require('./config/pg')
const { getHotelsAndServices} = require('./config/pg')


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

// api hotel and service
app.get('/hotelandservice', async(req, res) => {
    try{
		const HotelsAndServices = await getHotelsAndServices()
		res.json(HotelsAndServices)
	}catch(err){
		console.error(err)
		res.status(500).send('error')
	}
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
