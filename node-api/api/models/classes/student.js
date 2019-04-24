const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
    ],
    parents: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Parent'}
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
    birthDate: {
        type: Date
    },
    address: {
        type: String
    },
    country: String,
    photoUrl: String,
    bio: String,
    diseases: Array,
    interests: Array,
})

module.exports = mongoose.model('Student', studentSchema)