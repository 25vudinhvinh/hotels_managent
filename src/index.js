const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')
const pg = require('./config/pg')
const { getHotelsAndServices} = require('./config/pg')

const authRoutes = require("./routes/authRoutes"); 
require("dotenv").config();

// Middleware xử lý dữ liệu JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/admin', (req, res) => {
    res.render('admin');
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

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
