const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const ListToDo = require("../models/ListToDo");
const User = require("../models/User");
const bcrypt = require('bcryptjs');


require("dotenv").config();
// jest.setTimeout(7000);

let userLogin = {
    name: "Camilo",
    email: "example3@gmail.com",
    password: "123456"
}

let token = "";

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.DB_CONNECTION)
    token = await createMockUser(userLogin);
});

// /* Dropping the database and closing connection after each test. */
afterEach(async () => {
    await User.deleteMany();
    await ListToDo.deleteMany();
    await mongoose.connection.close();
});


describe('endpoint tests of listToDos', () => {

    // Testing in endpoint /api/toDo/createToDo/

    it("should create a task", async () => {
        const res = await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(201);
    });

    // Testing in endpoint /api/toDo/getToDos/

    it("should get all task", async () => {
        await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });
        const res = await request(app).get("/api/toDo/getToDos").set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.listToDos)).toBe(true);
        expect(res.body.listToDos).toHaveLength(1);
    });

    // Testing in endpoint update/api/toDo/updateToDo/


    it("should update a task", async () => {

        await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const res = await request(app).put(`/api/toDo/updateToDo/${idTask}`).set('x-token', token).send({
            title: "Buscar las esferas del dragon",
            task: "encontrar la esfera numero 2",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(200);
    });

    it("should update invalid id a task", async () => {

        const res = await request(app).put(`/api/toDo/updateToDo/63e6d82a54f5146570711b93`).set('x-token', token).send({
            title: "Buscar las esferas del dragon",
            task: "encontrar la esfera numero 2",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("The task does not exist by that id");
    });

    it("should update invalid token a task", async () => {

        await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const invalidToken = await createMockUser({
            name: "Danilo",
            email: "example4@gmail.com",
            password: "123456"
        })

        const res = await request(app).put(`/api/toDo/updateToDo/${idTask}`).set('x-token', invalidToken).send({
            title: "Buscar las esferas del dragon",
            task: "encontrar la esfera numero 2",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You are not authorized to perform this task");
    });


    // testing endponitn /api/toDo/deleteToDo

    it("should delete a task", async () => {

        await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const res = await request(app).delete(`/api/toDo/deleteToDo/${idTask}`).set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });
        console.log(res.body);
        expect(res.statusCode).toBe(200);
    });


    it("should delete invalid token a task", async () => {

        await request(app).post("/api/toDo/createToDo").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const invalidToken = await createMockUser({
            name: "Diego",
            email: "example5@gmail.com",
            password: "123456"
        })

        const res = await request(app).delete(`/api/toDo/deleteToDo/${idTask}`).set('x-token', invalidToken).send({
            title: "Buscar las esferas del dragon",
            task: "encontrar la esfera numero 2",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You are not authorized to delete this task");
    });

})

const createMockUser = async (userToCreate) => {

    const user = new User(userToCreate);
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();
    const response = await request(app).post("/api/auth").send(userToCreate);
    return response.body.token
}