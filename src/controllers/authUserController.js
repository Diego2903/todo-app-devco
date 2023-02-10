const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const {genereteJWT} = require('../helpers/jsonWebToken');


const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                ok : false,
                msg: 'the user does not exist with that email'
            })
        }

        const validPassword = bcrypt.compareSync( password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'
            })
        }

        await user.save();

        const token = await genereteJWT(user.id, user.name);

        res.status(200).json({
            ok : true,
            uid : user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg : 'please talk to the administrator'
        })
    }
}

const createUser = async (req, res = response) => {

    const {  email, password} = req.body;
    try {

        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                ok : false,
                msg: "There is already a user with that email"
            })
        }

        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();
        
        const token = await genereteJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid : user.id,
            name : user.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg : "please talk to the administrator"
        })
    }

}

const renewToken = async(req, res = response) => {

    const {uid, name} = req;

    const token = await genereteJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}