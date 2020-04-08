const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const REACTIONS = ['love', 'disgust', 'angry'];

let visitSchema = new mongoose.Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: true
    },
    reaction: {
        type: String,
        enum: REACTIONS
    },
    observation: String
})

visitSchema.statics.forUser = function(userId, page) {
    return Visit.paginate({'_user' : userId}, {page: page, limit: 5, sort: {'_id': 1 }});
}

visitSchema.plugin(mongoosePaginate)

const Visit = mongoose.model('Visit', visitSchema);

module.exports =  Visit;