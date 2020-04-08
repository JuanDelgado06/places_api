const {paramsBuilder} = require('./helpers');

const applicationParams = ['origins', 'name'];

const  Application = require('../models/Application');

const find = (req, res, next) => {
    Application.findById(req.params.id).then(application => {
        req.mainObj = application;
        req.application = application;
        next();
    }).catch(next);
}
const index = (req, res) => {
}
const create = (req, res) => {
    let params = paramsBuilder(applicationParams, req.body);

    Application.create(params)
        .then(application=> {
            res.json(application);
            console.log(application);
        }).catch(err => {
            res.status(422).res.json({err});
        })
}
const destroy = (req, res) => {
    req.application.remove().then(doc=>{
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