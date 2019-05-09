const mongoose = require('mongoose')

const educatorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
    ],
    name: {
        type: String
    },
    nationality: {
        type: String
    },
    education: [{
        certification: String,
        url: String
    }],
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
    password: {
        type: String
    },
    address: {
        type: String
    },
    country: String,
    photoUrl: String,
    bio: String,
})

module.exports = mongoose.model('Educator', educatorSchema)
