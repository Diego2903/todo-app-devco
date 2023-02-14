# todo-app-devco
Ejemplo de API REST en NodeJS, usando Mongo, JWT y con CI bajo GitHub Actions para fines educativos.

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=todo-app-devco&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=todo-app-devco)

[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=todo-app-devco&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=todo-app-devco)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=todo-app-devco&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=todo-app-devco)

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=todo-app-devco&metric=coverage)](https://sonarcloud.io/summary/new_code?id=todo-app-devco)

# Comandos
## Instalar dependencias
`npm install`
## Ejecutar el servicio
`npm run dev`
## Ejecutar pruebas unitarias
`npm run test`
## Compilar Docker
`docker build -t todo-app/node-web-app:latest .`

# Tecnologías y librerías usadas: Un poquito de su desarrollo
## `NodeJS. JS en Servidor.`
## `Mongo DB. I have used your Atlas cloud version`
## `Express. Web application framework for the API. With them I create and manage the routes. It also allows us to easily create middleware, with which we can apply specific logs, filter for authorizations and authentications, and expand through middleware. This is what I like the most about this bookstore. I recommend you look at the code of the route and middleware files to see how I perform these actions. One of the important things is how I have created the server so that it can be raised as an instance in each of the tests.`
## `Mongoose. Set of libraries to operate with MongoDB databases. I have implemented access using singleton.`
## `JWT-Simple. To implement JWT-based authentication. This library acts based on middleware with Express. The tokens themselves that expire depending on the value of .env TOKEN_LIFE in minutes. For the authorization part, we have also encapsulated in them whatever user permissions they have. We've also used UUID-based token refresh by storing the refresh tokens in MongoDB with a TTL index of the collection based on the value of .env TOKEN_REFRESH in minutes. In this way they self-destruct after that time and release the refresh tokens associated with the user token, giving a bit of extra security. The goal of implementing this type of refresh token is that if the access token has an expiration date, once it expires, the user would have to authenticate again to get an access token. With the refresh token, this step can be skipped and with a request to the API obtain a new access token that allows the user to continue accessing the application resources, until the refresh token expires. It must be taken into account that the TTL of the authentication token must be less than the refresh token.`
## `BCrypt. Cryptography library to manage user passwords.`
## `Body Parser. Middleware that parses bodies as objects.`
## `Cors. Middleware for CORS handling.`
## `Dotenv. To read the environment variables from the .env file`
## `GitHub Actions. It is one of the great tools that have been used for CI/CD continuous integration/distribution.`
## `supertest. The motivation with this module is to provide a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.`
## `Swagger. Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset. Find out how Swagger can help you design and document your APIs at scale.`
## `Postman. Is an API platform for building and using APIs. Postman simplifies each step of the API lifecycle and streamlines collaboration so you can create better APIs—faster.`

# Autor
## `Diego Fernando Roman Jaramillo <a href="https://www.linkedin.com/in/diego-roman-j/">`
