const requestSupertest = require("supertest");
const app = require("../../app");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ListToDo = require("../models/ListToDo");



let userLogin = {
    name: "Camilo",
    email: "example2@gmail.com",
    password: "123456"
}

let emailIncorrect = {
    email: "example7@gmail.com",
    password: "123456",
}

let passwordIncorrect = {
    email: "example2@gmail.com",
    password: "12345678",
}

let createTask = {
    title: "Buscar las gemas del infinito",
    task: "buscar la gema del poder",
    start: 2,
    end: 300000
}

const createMockUser = async (userToCreate) => {

    const user = new User(userToCreate);
    const salt = bcrypt.genSaltSync();

    user.password = bcrypt.hashSync(user.password, salt);

    await user.save();
    const response = await requestSupertest(app).post("/api/auth/login").send(userToCreate);
    return response.body.token
}



module.exports = {
    userLogin,
    requestSupertest,
    app,
    bcrypt,
    emailIncorrect,
    passwordIncorrect,
    createTask,
    User,
    ListToDo,
    createMockUser
}