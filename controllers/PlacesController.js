const Place = require('../models/Places')
const upload = require('../config/upload');
//const uploader = require('../models/Uploader');
const helpers = require('./helpers');

const validParams = ['title', 'description', 'address', 'acceptsCreditCard', 'openHour', 'closeHour']

const find = (req, res, next) => {
    Place.findOne({slug: req.params.id})
        .then(place=> {
            req.place = place;
            req.mainObj = place;
            next();
        }).catch(err => {
            next(err);
        })
} 

const index = async(req, res) => {
    //Todos los lugares
    await Place.paginate({}, { page: req.query.page || 1, limit:8, sort: {'_id' : -1} })
        .then(docs => {
            res.json(docs); 
        }).catch(err => {
        console.log(err);
        res.json(err);
    })
}
const create = async(req, res, next) => {
    //Crear nuevos lugares
    const params = helpers.paramsBuilder(validParams, req.body);
    console.log(req.user);
    params['_user'] = req.user.id;
    await Place.create(params)
    .then(doc => {
        req.place = doc;
        next();
    })
    .catch(err => { 
        next(err);
    })
}
const show = (req, res) => {
    res.json(req.place);
}
const update = async (req, res) => {
    //Actualizar un recurso
    const params = helpers.paramsBuilder(validParams, req.body);

    req.place = Object.assign(req.place, params)

    req.place.save()
        .then(doc=> {
            res.json(doc);
        }).catch(err => {
            console.log(err);
            res.json(err);
        })
}
const destroy = async (req, res) => {
    //Eliminar recursos
    req.place.remove()
        .then(doc => {
            res.json({});
        }).catch(err => {
            console.log(err);
            res.json(err);
        })
}

const multerMiddleware = () => {
    return upload.fields([
        {name: 'avatar', maxCount: 1},
        {name: 'cover', maxCount: 1}
    ]);
}

const saveImage = async (req, res) => {
    if(req.place) {
        if(req.files && req.files.cover && req.files.avatar) {
            const pathCover = req.files.cover[0].path;
            const pathAvatar = req.files.avatar[0].path;

            const coverPromise = req.place.updateCover(pathCover)
            const avatarPromise = req.place.updateAvatar(pathAvatar)

            const [coverUpdate, avatarUpdate] = await Promise.all([coverPromise, avatarPromise])

            res.json(req.place)
        } else if(req.files && req.files.cover) {
            const pathCover = req.files.cover[0].path;

            await req.place.updateCover(pathCover)
            
            res.json(req.place)
        } else if(req.files && req.files.avatar) {
            const pathAvatar = req.files.avatar[0].path;

            await req.place.updateAvatar(pathAvatar)
            
            res.json(req.place)
        } 
        else {
            res.json(req.place)
        }
    } else {
        res.status(422).json({
            error: req.error || 'Cloud not save places'
        })
    }
}

module.exports = {
    index,
    create,
    show,
    update,
    destroy,
    find,
    multerMiddleware,
    saveImage,
};
