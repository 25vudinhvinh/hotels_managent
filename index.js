const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path')

// template engine ejs
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
