const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const options = {
    origin: [process.env.FRONTEND_URL]
}

app.use(cors(options));
app.use('/public', express.static(path.join(__dirname, '..\\public')));
app.use(express.json());

app.use('/api/products', require('./product.router'));
app.use('/api/categories', require('./category.router'));
app.use('/api/auth', require('./auth.router'));

module.exports = app;