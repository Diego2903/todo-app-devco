const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require('../models/User');
const bcrypt = require('bcryptjs');

require("dotenv").config();
// jest.setTimeout(7000);

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

    const response = await request(app).post("/api/auth").send(userLogin);
    token = response.body.token
});


/* Dropping the database and closing connection after each test. */
afterEach(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
});


describe("POST /api/auth/new", () => {

    // Testing in endpoint /api/authUser/new

    it("should create a user", async () => {
        const res = await request(app).post("/api/auth/new").send({
            name: "Roberto",
            email: "example4@gmail.com",
            password: "123456",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Roberto");
    });

    // Testing in endpoint /api/authUser/

    it("should login a user", async () => {
        const res = await request(app).post("/api/auth").send(userLogin);
        expect(res.statusCode).toBe(200);
        expect(res.body.token).not.toBeNull();
    });

    it("login a user email incorrect", async () => {
        const res = await request(app).post("/api/auth").send({
            email: "example7@gmail.com",
            password: "123457"
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("the user does not exist with that email");
        expect(res.body.token).not.toBeNull();
    });

    it("login a user password incorrect", async () => {
        const res = await request(app).post("/api/auth").send({
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

        const res = await request(app).get("/api/auth/renew").set("x-token", token).send({
            name: userLogin.name,
            uid: user.uid
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).not.toBeNull();

    });
});






