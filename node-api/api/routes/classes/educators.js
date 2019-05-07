const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const axios = require('axios')
const EducatorModel = require('../../models/classes/educator')
const ClassModel = require('../../models/classes/class')

//tutors
router.get('/', (req, res, next) => {
    EducatorModel.find()
    .select('_id classes name nationality education phoneNumber email password address country photoUrl bio')
    .populate('classes', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            educators: docs.map(doc => {
                return {
                    _id: doc._id,
                    classes: doc.classes,
                    name: doc.name,
                    education: doc.education,
                    nationality: doc.nationality,
                    phoneNumber: doc.phoneNumber,
                    email: doc.email,
                    password: doc.password,
                    address: doc.address,
                    country: doc.country,
                    photoUrl: doc.photoUrl,
                    bio: doc.bio,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/educators/' + doc._id
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
    const Educator = new EducatorModel({
        _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
        classes: req.body.classes,
        name: req.body.name,
        education: req.body.education,
        nationality: req.body.nationality,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        country: req.body.country,
        photoUrl: req.body.photoUrl,
        bio: req.body.bio,
    })
    Educator.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: `You just created an educator account!`,
                createdEducator: {
                    _id: result._id,
                    classes: result.classes,
                    name: result.name,
                    education: result.education,
                    nationality: result.nationality,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    password: result.password,
                    address: result.address,
                    country: result.country,
                    photoUrl: result.photoUrl,
                    bio: result.bio,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/educators/' + result._id
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


//subject/:id
router.get('/:educatorId', (req, res, next) => {
    const id = req.params.educatorId
    EducatorModel.findById(id)
        .select('_id students name education nationality phoneNumber email password address country photoUrl bio')
        .populate('classes', 'name')
        .exec()
        .then(doc => {

                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        classes: doc.classes,
                        name: doc.name,
                        education: doc.education,
                        nationality: doc.nationality,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        password: doc.password,
                        address: doc.address,
                        country: doc.country,
                        photoUrl: doc.photoUrl,
                        bio: doc.bio,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/educators/' + doc._id
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

router.patch('/:educatorId', (req, res, next) => {
    const id = req.params.educatorId
    EducatorModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this educator account\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/educators' + id
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

router.delete('/:educatorId', (req, res, next) => {
    const id = req.params.educatorId

    //deletes all classes
    EducatorModel.findById(id)
        .exec()
        .then(doc => {
            doc.classes.forEach(instance => {
                ClassModel.findById(instance)
                    .exec()
                    .then(doc => {
                        if(doc.educators.length == 1 ) {
                            axios.delete(`http://localhost:8000/classes/${instance}`)
                              .then(result => console.log("deleting class...."))
                              .catch(err => console.Log(err))
                        } else {
                            console.log("Didn't delete educator's classes because they depend on other educators")
                            res.status(500).json({message: "Class depends on other educators"})
                        }
                    })
                    .catch(err => console.log(err))
            })
        })

    EducatorModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Educator account succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/educators/',
                    accepts: {
                        _id: 'ObjectId',
                        students: 'Array',
                        name: 'String',
                        education: 'Object',
                        nationality: 'String',
                        phoneNumber: 'String',
                        email: 'String',
                        password: 'String',
                        address: 'String',
                        country: 'String',
                        photoUrl: 'String',
                        bio: 'String',
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
