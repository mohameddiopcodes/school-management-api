const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ParentModel = require('../../models/classes/parent')
//const StudentModel = require('../../models/classes/student')

//Parents
router.get('/', (req, res, next) => {
    ParentModel.find()
    .select('_id students name nationality sexe phoneNumber email password address country photoUrl')
    .populate('students', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            parents: docs.map(doc => {
                return {
                    _id: doc._id,
                    students: doc.students,
                    name: doc.name,
                    nationality: doc.nationality,
                    sexe: doc.sexe,
                    phoneNumber: doc.phoneNumber,
                    email: doc.email,
                    password: doc.password,
                    address: doc.address,
                    country: doc.country,
                    photoUrl: doc.photoUrl,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/parents/' + doc._id
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
    // const studentId = req.params.studentId
    const Parent = new ParentModel({
        _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
        name: req.body.name,
        nationality: req.body.nationality,
        sexe: req.body.sexe,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        country: req.body.country,
        photoUrl: req.body.photoUrl,
    })
    //pushing both parent in student object and student in parent object
    // Parent.students.push(studentId)
    // StudentModel.findById(studentId)
    //     .exec()
    //     .then(doc => {
    //         doc.parents.push(Parent._id)
    //     })
    //saving parents and responding to request
    Parent.save()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: `You just created a parent account!`,
                createdParent: {
                    _id: result._id,
                    students: result.students,
                    name: result.name,
                    nationality: result.nationality,
                    sexe: result.sexe,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    password: result.password,
                    address: result.address,
                    country: result.country,
                    photoUrl: result.photoUrl,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/parents/' + result._id
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


//Parent/:id
router.get('/:parentId', (req, res, next) => {
    const id = req.params.parentId
    ParentModel.findById(id)
        .select('_id students name nationality sexe phoneNumber email password address country photoUrl')
        .populate('students', 'name')
        .exec()
        .then(doc => {

                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        students: doc.students,
                        name: doc.name,
                        nationality: doc.nationality,
                        sexe: doc.sexe,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        password: doc.password,
                        address: doc.address,
                        country: doc.country,
                        photoUrl: doc.photoUrl,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/parents/' + doc._id
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

router.patch('/:parentId', (req, res, next) => {
    const id = req.params.parentId
    ParentModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this parent account\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/parents' + id
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

router.delete('/:parentId', (req, res, next) => {
    const id = req.params.parentId
    ParentModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Parent account succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/parents/',
                    accepts: {
                        _id: 'ObjectId',
                        students: 'Array',
                        name: 'String',
                        nationality: 'String',
                        sexe: 'String',
                        phoneNumber: 'String',
                        email: 'String',
                        password: 'String',
                        address: 'String',
                        country: 'String',
                        photoUrl: 'String',
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