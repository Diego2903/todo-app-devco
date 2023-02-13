const express = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require("../controllers/authUserController");
const { validateJWT } = require('../middlewares/validate-jwt');
const { validate } = require('../middlewares/validators');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: the user name
 *        email:
 *          type: string
 *          description: the user email
 *        password:
 *          type: string
 *          description: the user password
 *      required:
 *         - name
 *         - email
 *         - password
 *      example:
 *         name: Diego Roman
 *         email : example@gmail.com
 *         password: 1234567
*/

/**
 * @swagger
 * /api/auth:
 *  post:
 *    summary: create a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201: 
 *        description: new user created
 *      400:
 *        description: Bad Request There is already a user with that email
 *      500:
 *        description: Internal Server Error
*/
router.post('/',
[
    check('name', 'the name is required').not().isEmpty(),
    check('email', 'the email is required').isEmail(),
    check('password', 'password must be longer than 6 characters').isLength({ min: 6 }),
    validate
],
createUser,

);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: login user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: the user email
 *              password:
 *                type: string
 *                description: the user password
 *    responses:
 *      200: 
 *        description: successful income
 *      400:
 *        description: Bad Request 
 *      500:
 *        description: Internal Server Error
 */
router.post('/login',
    [
        check('email', 'the email is required').isEmail(),
        check('password', 'password must be longer than 6 characters').isLength({ min: 6 }),
        validate
    ],
    loginUser,

);


/**
 * @swagger
 * /api/auth/renew:
 *  get:
 *    summary: renew token
 *    tags: [User]
 *    parameters:
 *      - in: header
 *        name: x-token
 *        schema:
 *          type: string
 *        required: true
 *        description: the token validate
 *      
 *    responses:
 *      200: 
 *        description: successful income 
 *        contens:
 *          application/json:
 */
router.get('/renew', validateJWT ,renewToken)

module.exports = router;