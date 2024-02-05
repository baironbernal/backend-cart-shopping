const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');


const getUsers = async(req, res) => {
    const since = Number(req.query.since) || 0;
    console.log(since);

    const [users, total] = await Promise.all([
        User.find({}).skip(since).limit(5),
        User.count()
    ])


    res.json({
        ok: true,
        users,
        total
    })
}

const createUser = async(req, res = response) => {

    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }
        const user = new User(req.body)
            //Encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        //Save User
        await user.save();

        //Generate token with JWT
        const token = await generateJWT(user.id)

        res.json({
            ok: true,
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }


}

const updateUser = async(req, res = response) => {
    const uid = req.params.id;
    try {

        const userExist = await User.findById(uid);

        if (!userExist) {
            return res.status(404).json({
                ok: false,
                msg: 'NO existe un usuario con ese id'
            })
        }

        const fields = req.body;
        delete fields.password;

        const userUpdated = await User.findByIdAndUpdate(uid, fields);

        res.json({
            ok: true,
            user: userUpdated,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const deleteUser = async(req, res = response) => {
    const uid = req.params.id;
    try {
        const userExist = await User.findById(uid);

        if (!userExist) {
            return res.status(404).json({
                ok: false,
                msg: 'NO existe un usuario con ese id'
            })
        }

        await User.findByIdAndDelete(uid)

        res.json({
            ok: true,
            msg: 'Usuario eliminado',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Usuario no pudo ser borrado'
        })
    }

}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
}