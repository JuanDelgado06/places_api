const User = require('../models/User');

const {paramsBuilder} = require('./helpers');
const userParams = ['email', 'name', 'password']

const index =  (req, res) =>{
    User.find({})
        .then(users => {
            res.json(users)
        }).catch(err => {
            console.log(err);
            res.json(err);
        })
}
const create = async(req,res, next) => {
    const params = paramsBuilder(userParams, req.body)
    await User.create(params)
        .then(user => {
            req.user= user;
            next();
        }).catch(err => {
            console.log(err);
            res.status(422).json({err});
        })
}
const myPlaces = (req,res) => {
    User.findOne({'_id': req.user.id}).then(user=>{
        //console.log(user.places);
        user.places.then(places=>{
            console.log(places);
            res.json(places);
        })
    }).catch(err=>{
        console.log(err);
        res.json(err);
    })
}  
const destroyUser = (req, res) => {
    User.findByIdAndRemove({_id: req.params.id})
        .then(doc => res.json({}))
        .catch(err => console.log(err))
}

module.exports = {
    index,
    create,
    myPlaces,
    destroyUser
}
