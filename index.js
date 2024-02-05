const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Express server created
const app = express();

//Base connection DB
dbConnection();

//Config CORS
app.use(cors());

//parse body request
app.use(express.json());

//Routes
app.use('/api/users/', require('./routes/user'));
app.use('/api/login/', require('./routes/auth'));
app.use('/api/products/', require('./routes/product'));

app.listen(process.env.PORT, () => {
    console.log('server corriendo en el puerto: ' + process.env.PORT);
})