const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    description: String,
    coefficient: Number,
    examDatetimes: Array,
    themes: [{
        name: String,
        chapters: [{
            name: String,
            notions: [{
                name: String,
                goals: Array,
            }]   
        }]
    }],
    classes: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Class'}
    ],
    sessions: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Session'}
    ],
})

module.exports = mongoose.model('Subject', subjectSchema)