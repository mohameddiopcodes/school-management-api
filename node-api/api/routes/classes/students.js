const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const StudentModel = require('../../models/classes/student')
const ClassModel = require('../../models/classes/class')

//student
router.get('/', (req, res, next) => {
    StudentModel.find()
    .select('_id classes parents name nationality sexe phoneNumber email password birthDate address country photoUrl bio diseases interests')
    .populate('classes', 'name')
    .populate('parents', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            students: docs.map(doc => {
                return {
                    _id: doc._id,
                    classes: doc.classes,
                    parents: doc.parents,
                    name: doc.name,
                    nationality: doc.nationality,
                    sexe: doc.sexe,
                    phoneNumber: doc.phoneNumber,
                    email: doc.email,
                    password: doc.password,
                    birthDate: doc.birthDate,
                    address: doc.address,
                    country: doc.country,
                    photoUrl: doc.photoUrl,
                    bio: doc.bio,
                    diseases: doc.diseases,
                    interests: doc.interests,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/students/' + doc._id
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

router.post('/', (req, res, next) => {
    const Student = new StudentModel({
        _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
        classes: req.body.classes,
        name: req.body.name,
        nationality: req.body.nationality,
        sexe: req.body.sexe,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        birthDate: req.body.birthDate,
        address: req.body.address,
        country: req.body.country,
        photoUrl: req.body.photoUrl,
        bio: req.body.bio,
        diseases: req.body.diseases,
        interests: req.body.interests,
    })
    Student.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: `You just created a student account!`,
                createdStudent: {
                    _id: result._id,
                    classes: result.classes,
                    name: result.name,
                    nationality: result.nationality,
                    sexe: result.sexe,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    password: result.password,
                    birthDate: result.birthDate,
                    address: result.address,
                    country: result.country,
                    photoUrl: result.photoUrl,
                    bio: result.bio,
                    diseases: result.diseases,
                    interests: result.interests,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/students/' + result._id
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


//student/:id
router.get('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    StudentModel.findById(id)
        .select('_id classes parents name nationality sexe phoneNumber email password birthDate address country photoUrl bio diseases interests')
        .populate('classes', 'name')
        .populate('parents', 'name')
        .exec()
        .then(doc => {
                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        classes: doc.classes,
                        parents: doc.parents,
                        name: doc.name,
                        nationality: doc.nationality,
                        sexe: doc.sexe,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        password: doc.password,
                        birthDate: doc.birthDate,
                        address: doc.address,
                        country: doc.country,
                        photoUrl: doc.photoUrl,
                        bio: doc.bio,
                        diseases: doc.diseases,
                        interests: doc.interests,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/students/' + doc._id
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

router.patch('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    StudentModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this student account\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/students' + id
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

router.delete('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    StudentModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Student account succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/students/',
                    accepts: {
                        _id: 'ObjectId',
                        classes: 'Array',
                        name: 'String',
                        nationality: 'String',
                        sexe: 'String',
                        phoneNumber: 'String',
                        email: 'String',
                        password: 'String',
                        birthDate: 'Date',
                        address: 'String',
                        country: 'String',
                        photoUrl: 'String',
                        bio: 'String',
                        diseases: 'Array',
                        interests: 'Array',
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