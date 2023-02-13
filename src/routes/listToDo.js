const express = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getToDos, createToDo, updateToDo, deleteToDo } = require("../controllers/listTodoControllers");
const {validate} = require('../middlewares/validators');
const {check} = require('express-validator');
const { isDate } = require('../helpers/isDate');
const router = express.Router();

router.use(validateJWT);

/**
 * @swagger
 * components:
 *  schemas:
 *    ListToDo:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: the listToDo title
 *        task:
 *          type: string
 *          description: the listToDo task
 *        start:
 *          type: date
 *          description: the listToDo date start
 *        end:
 *          type: date
 *          description: the listToDo date end
 *        check:
 *          type: boolean
 *          description: the listToDo check
 *        user: 
 *          type: string
 *          description: the listToDo user
 *      required:
 *         - title
 *         - task
 *         - start
 *         - end
 *         - user 
 *      example:
 *         title: buscar las gemas del infinito
 *         task : buscar la gema de la mente
 *         start : 1
 *         end : 1000000
 *         user: 63e296ca9b962582297129e5
 */

/**
 * @swagger
 * /api/to-do:
 *  post:
 *    summary: create a new task
 *    tags: [ListToDo]
 *    parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token validate
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ListToDo'
 *    responses:
 *      201: 
 *        description: new user created
 *      500:
 *        description: Internal Server Error
*/
router.post('/', 
[
    check('title', 'the title is required').not().isEmpty(),
    check('task', 'the task is required').not().isEmpty(),
    check('start', 'start date is mandatory').custom(isDate),
    check('end', 'end date is mandatory').custom(isDate),
    validate
],
createToDo);

/**
 * @swagger
 * /api/to-do:
 *  get:
 *    summary: list all task
 *    tags: [ListToDo]
 *    parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token validate
 *    requestBody:
 *      required: false
 *    responses:
 *      200: 
 *        description: processed correctly
 *    content:
 *      application/json:
*/
router.get('/', getToDos);


/**
 * @swagger
 * /api/to-do/:id:
 *  put:
 *    summary: update one task
 *    tags: [ListToDo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ListToDo'
 *    parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token validate
 *      - in: path
 *        name: id-task
 *        schema:
 *          type: string
 *        required: true
 *        description: the id task update
 *    responses:
 *      200: 
 *        description: processed correctly
 *      401: 
 *        description: Unauthorized perform this task
 *      404:
 *        description: Not found task not exist by that id
 *      500:
 *        description: Internal Server Error
*/
router.put('/:id', updateToDo);

/**
 * @swagger
 * /api/to-do/:id:
 *  delete:
 *    summary: delete one task
 *    tags: [ListToDo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ListToDo'
 *    parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token validate
 *      - in: path
 *        name: id-task
 *        schema:
 *          type: string
 *        required: true
 *        description: the id task update
 *    responses:
 *      200: 
 *        description: processed correctly
 *      401: 
 *        description: Unauthorized delete this task
 *      404:
 *        description: Not found task not exist by that id
 *      500:
 *        description: Internal Server Error
*/
router.delete('/:id', deleteToDo);


module.exports = router;