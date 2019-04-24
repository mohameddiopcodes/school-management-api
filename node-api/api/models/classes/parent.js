const mongoose = require('mongoose')

const parentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    students: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Student'}
    ],
    name: {
        type: String
    },
    nationality: {
        type: String
    },
    sexe: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    country: String,
    photoUrl: String,
})

module.exports = mongoose.model('Parent', parentSchema)