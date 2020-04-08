const slug = require('mongoose-slug-updater');
const mongoose = require('mongoose');
mongoose.plugin(slug);
const mongoosePaginate = require('mongoose-paginate')

const uploader = require('./Uploader');

const Visit = require('./Visit');

let placeShema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'title',
        permanent: true,
        slugPaddingSize: 2,
        unique: true
    },
    description: String,
    acceptsCreditCard: {
        type: Boolean,
        default: false
    },
    address: String,
    coverImage: String,
    avatarImage: String,
    openHour: Number,
    closeHour: Number,
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
//Funcion para subir imagen Avatar en la nube de cloudinary
placeShema.methods.updateAvatar = function(path) {
    // Primero subir la imagen y guardarla
    return uploader(path)
        .then(secure_url => this.saveAvatarUrl(secure_url))
}
//FUncionn para subir la imagen Cover en la nube de cloudinary
placeShema.methods.updateCover = function(path) {
    // Primero subir la imagen y guardarla
    return uploader(path)
        .then(secure_url => this.saveCoverUrl(secure_url))
}
//Funcion para guardar el path de la imagen en la base de datos
placeShema.methods.saveAvatarUrl = function(secureUrl) {
    this.avatarImage = secureUrl;
    return this.save();
}
//Funcion para guardar el path de la imagen en la base de datos
placeShema.methods.saveCoverUrl = function(secureUrl) {
    this.coverImage = secureUrl;
    return this.save();
}
//Se busca todas las visitas con '_place' y que este coincida con el id del place, luego se ordena de menor a mayor
placeShema.virtual('visits').get(function() {
    return Visit.find({'_place': this._id}).sort('-id');
})

placeShema.plugin(mongoosePaginate);

let Place = mongoose.model('Place', placeShema);

module.exports = Place;