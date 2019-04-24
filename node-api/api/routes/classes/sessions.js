const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const SessionModel = require('../../models/classes/session')
const SubjectModel = require('../../models/classes/subject')

//Etablissements
router.get('/', (req, res, next) => {
    SessionModel.find()
        .select('_id subject datetime duration presenceList hasAssessment assessments isEvaluation evaluations isPractical practicals isLecture lectures')
        .populate('subject', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                sessions: docs.map(doc => {
                    return {
                        _id: doc._id,
                        subject: doc.subject,
                        datetime: doc.datetime,
                        duration: doc.duration,
                        presenceList: doc.presenceList,
                        hasAssessment: doc.hasAssessment,
                        assessments: doc.assessments,
                        isEvaluation: doc.isEvaluation,
                        evaluations: doc.evaluations,
                        isPractical: doc.isPractical,
                        practicals: doc.practicals,
                        isLecture: doc.isLecture,
                        lectures: doc.lectures,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/sessions/' + doc._id
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

router.post('/:subjectId', (req, res, next) => {
    SubjectModel.findById(req.params.subjectId)
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(400).json({
                message: 'Subject not found'
            })
        }

        const Session = new SessionModel({
            _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
            subject: doc._id,
            datetime: req.body.datetime,
            duration: req.body.duration,
            presenceList: req.body.presenceList,
            hasAssessment: req.body.hasAssessment,
            assessments: req.body.assessments,
            isEvaluation: req.body.isEvaluation,
            evaluations: req.body.evaluations,
            isPractical: req.body.isPractical,
            practicals: req.body.practicals,
            isLecture: req.body.isLecture,
            lectures: req.body.lectures,
        })

        Session.save()
            .then(result => {
                console.log(result)
                //pushing session in subject
                doc.sessions.push(result._id)
                doc
                    .save()
                    .then()
                    .catch(err => console.log(err))

                res.status(200).json({
                    message: `You just created a Session for this Subject`,
                    createdSession: {
                        _id: result._id,
                        subject: result._id,
                        datetime: result.datetime,
                        duration: result.duration,
                        presenceList: result.presenceList,
                        hasAssessment: result.hasAssessment,
                        assessments: result.assessments,
                        isEvaluation: result.isEvaluation,
                        evaluations: result.evaluations,
                        isPractical: result.isPractical,
                        practicals: result.practicals,
                        isLecture: result.isLecture,
                        lectures: result.lectures,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/sessions/' + result._id
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


//Etablissement/:id
router.get('/:sessionId', (req, res, next) => {
    const id = req.params.sessionId
    SessionModel.findById(id)
        .select('_id subject datetime duration presenceList hasAssessment assessments isEvaluation evaluations isPractical practicals isLecture lectures')
        .populate('subject', 'name')
        .exec()
        .then(doc => {
                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        subject: doc.subject,
                        datetime: doc.datetime,
                        duration: doc.duration,
                        presenceList: doc.presenceList,
                        hasAssessment: doc.hasAssessment,
                        assessments: doc.assessments,
                        isEvaluation: doc.isEvaluation,
                        evaluations: doc.evaluations,
                        isPractical: doc.isPractical,
                        practicals: doc.practicals,
                        isLecture: doc.isLecture,
                        lectures: doc.lectures,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/sessions/' + doc._id
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

router.patch('/:sessionId', (req, res, next) => {
    const id = req.params.sessionId
    SessionModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this session\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/sessions/' + id
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

router.delete('/:sessionId', (req, res, next) => {
    const id = req.params.sessionId       
    SessionModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Session account succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/sessions/',
                    accepts: {
                        _id: 'ObjectId',
                        subject: 'ObjectId',
                        datetime: 'Date',
                        duration: 'String',
                        presenceList: 'Array of Objects',
                        hasAssessment: 'Boolean',
                        assessments: 'Array of Objects',
                        isEvaluation: 'Boolean',
                        evaluations: 'Array of Objects',
                        isPractical: 'Boolean',
                        practicals: 'Array of Objects',
                        isLecture: 'Boolean',
                        lectures: 'Array of Objects',
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
module.exports = router