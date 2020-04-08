const {paramsBuilder} = require('./helpers');

const visitParams = ['_place', 'reaction', 'observation'];

const  Visit = require('../models/Visit');
const User = require('../models/User');

const find = (req, res, next) => {
    Visit.findById(req.params.visit_id).then(visit => {
        req.mainObj = visit;
        req.visit = visit;
        next();
    }).catch(next);
}
const index = (req, res) => {
    let promise = null;

    if (req.place) {
        promise = req.place.visits;
    } else if (req.user) {
        promise = Visit.forUser(req.user.id, req.query.page || 1)
    }

    if (promise) {
        promise.then(visits => {
            res.json(visits);
        }).catch(err => console.log(err))
    } else {
        res.status(404).res.json({})
    }
}
const create = (req, res) => {
    let params = paramsBuilder(visitParams, req.body);
    params['_user'] = req.user.id;

    Visit.create(params)
        .then(visit=> {
            res.json(visit);
            console.log(visit);
        }).catch(err => {
            res.status(422).res.json({err});
        })
}
const destroy = (req, res) => {
    req.visit.remove().then(doc=>{
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