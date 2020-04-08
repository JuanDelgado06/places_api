const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');

const User = require('../models/User');

const authenticate = (req, res, next) => {

    User.findOne({email: req.body.email})
        //Verificamos si el usuario existe
        .then(user => {
            //Verificamos si la contraseña es correcta con un metodo de mongoose-bcrypt
            user.verifyPassword(req.body.password)
                .then(valid => {
                    if(valid) {
                        req.user = user;
                        next();
                    } else {
                        next(new Error('Credenciales Invalidas'));
                    }
                })
        }).catch(err => next(err));

}

const generateToken = (req, res, next) => {
    if(!req.user) return next();
    //Generando nuestro token por ID y con la clave secreta
    req.token = jwt.sign({id : req.user._id}, secrets.jwtSecret);
    //Una vez generado ponemos next para seguir con la funcion de sendToken()
    next();
}

const sendToken = (req, res) => {
    if(req.user) {
        res.json({
            user: req.user,
            jwt: req.token
        })
    }else {
        res.status(422).json({
            error: 'Could not create User'
        })
    }
}

module.exports = {
    authenticate,
    generateToken,
    sendToken
}