const mongoose = require("mongoose");
const { User, requestSupertest, userLogin, app, createTask, createMockUser, ListToDo, updateTask, differentUser } = require("./helpers");

require("dotenv").config();

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
        const res = await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);
        expect(res.statusCode).toBe(201);
    });

    // Testing in endpoint /api/toDo/getToDos/

    it("should get all task", async () => {
        await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);
        const res = await requestSupertest(app).get("/api/to-do").set('x-token', token);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.listToDos)).toBe(true);
        expect(res.body.listToDos).toHaveLength(1);
    });

    // Testing in endpoint update/api/toDo/updateToDo/


    it("should update a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const res = await requestSupertest(app).put(`/api/to-do/${idTask}`).set('x-token', token).send(updateTask);
        expect(res.statusCode).toBe(200);
    });


    it("should update invalid id a task", async () => {

        const res = await requestSupertest(app).put(`/api/to-do/63e6d82a54f5146570711b93`).set('x-token', token).send(createTask);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("The task does not exist by that id");
    });

    it("should update invalid token a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const invalidToken = await createMockUser(differentUser)

        const res = await requestSupertest(app).put(`/api/to-do/${idTask}`).set('x-token', invalidToken).send(updateTask);
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You are not authorized to perform this task");
    });


    // testing endponitn /api/toDo/deleteToDo

    it("should delete a task", async () => {

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
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

        await requestSupertest(app).post("/api/to-do").set('x-token', token).send(createTask);

        let task = await ListToDo.findOne({ title: "Buscar las gemas del infinito" });
        const idTask = task.id;

        const invalidToken = await createMockUser(differentUser)

        const res = await requestSupertest(app).delete(`/api/to-do/${idTask}`).set('x-token', invalidToken).send();
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You are not authorized to delete this task");
    });

})

