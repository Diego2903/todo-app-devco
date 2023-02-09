const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');

const options = {
    definition : {
        openapi : '3.0.0',
        info : { title : 'ToDo App',version : '1.0.0'},
        
    },
    apis: ['src/routes/authUser.js', 'src/routes/listToDo.js']
}

// Docs en JSON format
const swaggerSpec = swaggerJsDoc(options);

// Function to setup our docs

const swaggerDocs = (app, port) => {
    app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec, { explorer: true}));
    app.get('/api/auth/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })

    console.log(`Docs available at http://localhost:${port}/api/docs`);
}

module.exports = {
    swaggerDocs
}