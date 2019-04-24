const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    school: {
        type: mongoose.Schema.Types.ObjectId, ref: 'School'
    },
    educators: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Educator'}
    ],
    students: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Student'}
    ],
    subjects: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}
    ],
    name: {
        type: String, required: true
    },
    year: {
        type: String, required: true
    },
    price: {
        type: Number, min: 0
    },
    photoUrl: String,
    bio: String,
})

module.exports = mongoose.model('Class', classSchema)