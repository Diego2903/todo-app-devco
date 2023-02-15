const mongoose = require("mongoose");
const requestSupertest = require("supertest");
const app = require("../../app");
const User = require('../models/User');
const bcrypt = require('bcryptjs');

require("dotenv").config();

let userLogin = {
    name: "Camilo",
    email: "example2@gmail.com",
    password: "123456"
}

let token = "";

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_CONNECTION)
    const user = new User(userLogin);
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();

    const response = await requestSupertest(app).post("/api/auth/login").send(userLogin);
    token = response.body.token
});


/* Dropping the database and closing connection after each test. */
afterEach(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});


describe("POST /api/auth", () => {

    // Testing in endpoint /api/auth-user/

    it("should create a user", async () => {
        const res = await requestSupertest(app).post("/api/auth").send({
            name: "Roberto",
            email: "example4@gmail.com",
            password: "123456",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Roberto");
    });

    
    it("should create a user repeat email", async () => {
        await requestSupertest(app).post("/api/auth").send({
            name: "Roberto",
            email: "example4@gmail.com",
            password: "123456",
        });

        const res = await requestSupertest(app).post("/api/auth").send({
            name: "Roberto",
            email: "example4@gmail.com",
            password: "123456",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("There is already a user with that email");
    });

    // Testing in endpoint /api/auth-user/

    it("should login a user", async () => {
        const res = await requestSupertest(app).post("/api/auth/login").send(userLogin);
        expect(res.statusCode).toBe(200);
        expect(res.body.token).not.toBeNull();
    });

    it("login a user email incorrect", async () => {
        const res = await requestSupertest(app).post("/api/auth/login").send({
            email: "example7@gmail.com",
            password: "123457"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("the user does not exist with that email");
        expect(res.body.token).not.toBeNull();
    });

    it("login a user password incorrect", async () => {
        const res = await requestSupertest(app).post("/api/auth/login").send({
            email: "example2@gmail.com",
            password: "123458"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Password incorrect");
        expect(res.body.token).not.toBeNull();
    });

    // Testing in endpoint /api/authUser/renew

    it("should renew token", async () => {

        let user = await User.findOne({ email: userLogin.email });

        const res = await requestSupertest(app).get("/api/auth/renew").set("x-token", token).send({
            name: userLogin.name,
            uid: user.uid
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).not.toBeNull();

    });
});






