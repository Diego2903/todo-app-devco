const mongoose = require("mongoose");
const requestSupertest = require("supertest");
const app = require("../../app");
const ListToDo = require("../models/ListToDo");
const User = require("../models/User");
const bcrypt = require('bcryptjs');


require("dotenv").config();

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

    // Testing in endpoint /api/to-do

    it("should create a task", async () => {
        const res = await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema del poder",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(201);
    });

    // Testing in endpoint /api/toDo/getToDos/

    it("should get all task", async () => {
        await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Buscar las esferas del dragon",
            task: "buscar la esfera numero 4",
            start: 1,
            end: 400000
        });
        const res = await requestSupertest(app).get("/api/to-do").set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.listToDos)).toBe(true);
        expect(res.body.listToDos).toHaveLength(1);
    });

    // Testing in endpoint update/api/toDo/updateToDo/


    it("should update a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Realizar tareas de la casa",
            task: "Barrer el cuarto",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Realizar tareas de la casa" });
        const idTask = task.id;

        const res = await requestSupertest(app).put(`/api/to-do/${idTask}`).set('x-token', token).send({
            title: "Realizar tareas de la casa",
            task: "Trapear toda la casa",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(200);
    });


    it("should update invalid id a task", async () => {

        const res = await requestSupertest(app).put(`/api/to-do/63e6d82a54f5146570711b93`).set('x-token', token).send({
            title: "Buscar las esferas del dragon",
            task: "encontrar la esfera numero 2",
            start: 2,
            end: 300000
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("The task does not exist by that id");
    });

    it("should update invalid token a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Buscar las gemas del infinito",
            task: "buscar la gema de la destruccion",
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

        const res = await requestSupertest(app).put(`/api/to-do/${idTask}`).set('x-token', invalidToken).send({
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

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Buscar curso para estudiar nextJs",
            task: "Encontrar un buen curso",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Buscar curso para estudiar nextJs" });
        const idTask = task.id;

        const res = await requestSupertest(app).delete(`/api/to-do/${idTask}`).set('x-token', token).send();
        expect(res.statusCode).toBe(200);
    });


    it("should delete invalid id a task", async () => {

        const res = await requestSupertest(app).delete(`/api/to-do/63ec27b04f91d4f8fa0016a0`).set('x-token', token).send();
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("The task does not exist by that id");    
    });

    it("should delete invalid token a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send({
            title: "Planes diarios de la semana",
            task: "Ir al gimnasio",
            start: 2,
            end: 300000
        });

        let task = await ListToDo.findOne({ title: "Planes diarios de la semana" });
        const idTask = task.id;

        const invalidToken = await createMockUser({
            name: "Diego",
            email: "example5@gmail.com",
            password: "123456"
        })

        const res = await requestSupertest(app).delete(`/api/to-do/${idTask}`).set('x-token', invalidToken).send();
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You are not authorized to delete this task");
    });

})

const createMockUser = async (userToCreate) => {

    const user = new User(userToCreate);
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();
    const response = await requestSupertest(app).post("/api/auth/login").send(userToCreate);
    return response.body.token
}