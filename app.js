const express = require('express');
const { dbConnection } = require('./src/database/config');
const cors = require('cors');
require('dotenv').config();

const app = express();

// base de datos

dbConnection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('./public') );

// Parseo del body

app.use(express.json());

// Rutas

app.use('/api/auth', require('./src/routes/authUser'));
app.use('/api/to-do', require('./src/routes/listToDo'));
app.use('/', require('./src/swaggerDocs/swagger'));


module.exports = app;
