const express = require('express');
const { dbConnection } = require('./src/database/config');
const { swaggerDocs } = require('./src/swaggerDocs/swagger');
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
app.use('/api/toDo', require('./src/routes/listToDo'));


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    swaggerDocs(app, process.env.PORT);
});


