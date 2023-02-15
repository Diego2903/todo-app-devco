const { response } = require('express');
const ListToDo = require('../models/ListToDo');



const getToDos = async (req, res = response) => {

    const listToDos = await ListToDo.find()
        .populate('user', 'name')
    res.json({
        ok: true,
        listToDos
    })
}

const createToDo = async (req, res = response) => {

    const listToDo = new ListToDo(req.body);

    try {

        listToDo.user = req.uid;

        const listToDoSave = await listToDo.save()

        res.status(201).json({
            ok: true,
            listToDo: listToDoSave
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to the admin'
        })
    }
}

const updateToDo = async(req, res = response) => {

    const taskId = req.params.id;
    const uid = req.uid;

    try {

        const task = await ListToDo.findById(taskId);

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: 'The task does not exist by that id'
            })
        }

        if (task.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to perform this task'
            });
        }

        const newTask = {
            ...req.body,
            user: uid
        }

        const taskUpdate = await ListToDo.findByIdAndUpdate(taskId, newTask, { new: true });

        res.json({
            ok: true,
            task: taskUpdate
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to the admin'
        })
    }

}

const deleteToDo = async(req, res = response) => {
    const taskId = req.params.id;
    const uid = req.uid;

    try {

        const task = await ListToDo.findById(taskId);

        if (!task) {
            return res.status(404).json({
                ok: false,
                msg: 'The task does not exist by that id'
            })
        }

        if (task.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'You are not authorized to delete this task'
            });
        }

        const deleteTask = await ListToDo.findByIdAndDelete(taskId);

        res.json({
            ok: true,
            deleteTask
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'talk to the admin'
        })
    }
}

module.exports = {
    getToDos,
    createToDo,
    updateToDo,
    deleteToDo
}
