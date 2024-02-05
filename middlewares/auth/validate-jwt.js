const { response } = require('express');
const jwt = require('jsonwebtoken');

const validateJWT = (req, res = response, next) => {

    //Read token since headers (x-token)
    const token = req.header('x-token');


    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'NO existe token en la peticion'
        });
    }

    try {
        //Use the seed o base (process.env.JWT_SECRET) and verify if match with the token
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        console.log(uid)
    } catch (error) {
        return res.status(401).json({

            ok: false,
            mesg: 'TOken no valido'
        })
    }



    next();
}

module.exports = { validateJWT }