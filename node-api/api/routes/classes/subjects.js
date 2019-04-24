const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const SubjectModel = require('../../models/classes/subject')
const ClassModel = require('../../models/classes/class')
const SessionModel = require('../../models/classes/session')


//subjects
router.get('/', (req, res, next) => {
    SubjectModel.find()
        .select('_id name description coefficient examDatetimes themes classes sessions')
        .populate('classes', 'name')
        .populate('sessions', 'datetime')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                subjects: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        coefficient: doc.coefficient,
                        examDatetimes: doc.examDatetimes,
                        themes: doc.themes,
                        classes: doc.classes,
                        sessions: doc.sessions,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/subjects/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
})

router.post('/:classId', (req, res, next) => {
    ClassModel.findById(req.params.classId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(400).json({
                    message: 'Class not found'
                })
            }

            const Subject = new SubjectModel({
                _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
                name: req.body.name,
                description: req.body.description,
                coefficient: req.body.coefficient,
                examDatetimes: req.body.examDatetimes,
                themes: req.body.themes,
            })
            //pushing classe in subject
            Subject.classes.push(doc._id)

            Subject.save()
                .then(result => {
                    console.log(result)
                    //pushing subject in class
                    doc.subjects.push(result._id)
                    doc
                        .save()
                        .then()
                        .catch(err => console.log(err))

                    res.status(200).json({
                        message: `You just created a Subject for this Class`,
                        createdSubject: {
                            _id: result._id,
                            name: result.name,
                            description: result.description,
                            coefficient: result.coefficient,
                            examDatetimes: result.examDatetimes,
                            themes: result.themes,
                            classes: result.classes,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/subjects/' + result._id
                            }
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        })
})


//subject/:id
router.get('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId
    SubjectModel.findById(id)
        .select('_id name description coefficient examDatetimes themes classes sessions')
        .populate('classes', 'name')
        .populate('sessions', 'datetime')
        .exec()
        .then(doc => {
                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        name: doc.name,
                        description: doc.description,
                        coefficient: doc.coefficient,
                        examDatetimes: doc.examDatetimes,
                        themes: doc.themes,
                        classes: doc.classes,
                        sessions: doc.sessions,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/subjects/' + doc._id
                        }
                    })
                } else {
                    res.status(404).json({
                        message: 'Id doesn\'t match any entry in database'
                    })
                }
                
            })
        .catch(err => {
            console.log(err)
            res.status(500).json({error: err})
        })
})

router.patch('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId
    SubjectModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this subject\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/subjects/' + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

router.delete('/:subjectId', (req, res, next) => {
    const id = req.params.subjectId
    SubjectModel.findById(id)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Subject not found'
                })
            }
        })

    //deleting Sessions
    SessionModel.deleteMany({subject: id})
        .exec()
        .then(result => console.log('\ndeleting sessions....\n'))
        .catch(err => console.log(err))

    //deleting Subject
    SubjectModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Subject succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/subjects/',
                    accepts: {
                        _id: 'ObjectId',
                        name: 'String',
                        description: 'String',
                        coefficient: 'Number',
                        examDatetimes: 'Date',
                        themes: 'Object',
                        classes: 'Array',
                        sessions: 'Array',
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: err
            })
        })
})

module.exports = router