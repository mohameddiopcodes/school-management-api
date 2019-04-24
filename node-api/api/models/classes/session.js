const mongoose = require('mongoose')

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subject: {
        type: mongoose.Types.ObjectId, ref: 'Subject'
    },
    datetime: { 
        type : Date,
    },
    duration: String,
    presenceList: [{
        student: {
            type: mongoose.Types.ObjectId, ref: 'Student'
        },
        isPresent: {type: Boolean, default: false},
    }],
    hasAssessment: Boolean,
    assessments: [{
        nature: String,
        uploader: String,
        url: String,
        due: Date,
        chapters: [{
            name: String,
            notions: [{
                name: String,
                goals: Array,
            }]
        }],
        scores: [{
            student: {
                type: mongoose.Types.ObjectId, ref: 'Student'
            },
            grade: String,
        }],
    }],
    isEvalution: Boolean,
    evaluations: [{
        nature: String,
        duration: String,
        maxScore: Number,
        uploader: String,
        url: String,
        chapters: [{
            name: String,
            notions: [{
                name: String,
                goals: Array,
            }]
        }],
        scores: [{
            student: {
                type: mongoose.Types.ObjectId, ref: 'School'
            },
            grade: String,
        }],
    }],
    isPractical: Boolean,
    practicals: [{
        nature: String,
        duration: String,
        maxScore: Number,
        uploader: String,
        url: String,
        chapters: [{
            name: String,
            notions: [{
                name: String,
                goals: Array,
            }]
        }],
        scores: [{
            student: {
                type: mongoose.Types.ObjectId, ref: 'School'
            },
            grade: String,
        }],
    }],
    isLecture: Boolean,
    lectures: [{
        nature: String,
        duration: String,
        url: String,
        chapters: [{
            name: String,
            notions: [{
                name: String,
                goals: Array,
            }]
        }],
    }]
})

module.exports = mongoose.model('Session', sessionSchema)