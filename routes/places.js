const express = require('express');
const router= express.Router();

const placesController = require('../controllers/PlacesController');

const authenticateOwner = require('../middlewares/authenticateOwner');

router.route('/')
    //Ruta para obtener todos los datos de places
    .get(placesController.index)
    //Ruta para añadir un places
    .post(placesController.multerMiddleware(), placesController.create, placesController.saveImage)

/* router.route('/favorites')
    .get(jwtMiddleware({secret: secrets.jwtSecret}),placesController.favorites) */

router.route('/:id')
    //Ruta para Obtener un lugar en especifico con el id
    .get(placesController.find, placesController.show)
    //Ruta para Actualizar un lugar en especifico con el id
    .put(placesController.find, authenticateOwner, placesController.update)
    //Ruta para Eliminar un lugar en especifico con el id
    .delete(placesController.find, authenticateOwner, placesController.destroy)

module.exports = router;