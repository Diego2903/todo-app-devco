const app = require("./app");
const { swaggerDocs } = require("./src/swaggerDocs/swagger");

swaggerDocs(app, process.env.PORT);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
