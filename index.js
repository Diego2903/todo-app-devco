const app = require("./app");
const { swaggerDocs } = require("./src/swaggerDocs/swagger");


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
    swaggerDocs(app, process.env.PORT);
});
