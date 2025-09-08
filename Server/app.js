const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDB = require('./DataBase/DB');
const userRoutes = require('./Routes/User.Route');
const app = express();

// ...


app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToDB();

app.get('/', (req, res) => {
    res.send('hell0 world');
});


app.use('/api/users', userRoutes);

module.exports = app; 