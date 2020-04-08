const {paramsBuilder} = require('./helpers');

const favoriteParams = ['_place'];

const  FavoritePlace = require('../models/FavoritePlace');
const User = require('../models/User');

const find = (req, res, next) => {
    FavoritePlace.findById(req.params.id).then(fav => {
        req.mainObj = fav;
        req.favorite = fav;
        next();
    }).catch(next);
}
const index = (req, res) => {
        if(!req.fullUser) return res.json({});
        req.fullUser.favorites.then(places => {
            res.json(places);
        }).catch(err=> {
            console.log(err);
            res.json(err)
        })
}
const create = (req, res) => {
    let params = paramsBuilder(favoriteParams, req.body);
    params['_user'] = req.user.id;

    FavoritePlace.create(params)
        .then(favorite=> {
            res.json(favorite);
            console.log(favorite);
        }).catch(err => {
            res.status(422).res.json({err});
        })
}
const destroy = (req, res) => {
    req.favorite.remove().then(doc=>{
        res.json({})
    }).catch(error => {
        res.status(500).json({error});
        console.log(error);
    })
}

module.exports = {
    index,
    find,
    create,
    destroy
}