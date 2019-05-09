const mongoose = require('mongoose')
const schema = new mongoose.Schema

const schoolSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    classes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
    ],
    levels: [{
        name: {type: String},
        numberOfClasses: {type: Number}
    }],
    name: {
        type: String
    },
    type: {
        type: String
    },
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
    isPublic: {
        type: Boolean, default: false
    },
    address: {
        type: String
    },
    country: String,
    photoUrl: String,
    since: Date,
    bio: String,
})

schema.pre('save', (doc, next) => {
    console.log('Inside saveee BITCCHHHHH')
})

module.exports = mongoose.model('School', schoolSchema)
