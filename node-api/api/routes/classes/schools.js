//setting up
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const SchoolModel = require('../../models/classes/school')
const ClassModel = require('../../models/classes/class')
const axios = require('axios')

//Etablissements
//GET SCHOOLS
router.get('/', (req, res, next) => {
    SchoolModel.find()
        .select('_id classes name type phoneNumber email isPublic address country photoUrl since bio')
        .populate('classes', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                schools: docs.map(doc => {
                    return {
                        _id: doc._id,
                        classes: doc.classes,
                        name: doc.name,
                        type: doc.type,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        isPublic: doc.isPublic,
                        address: doc.address,
                        country: doc.country,
                        photoUrl: doc.photoUrl,
                        since: doc.since,
                        bio: doc.bio,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/schools/' + doc._id
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

//POST SCHOOLS
router.post('/', (req, res, next) => {
    const School = new SchoolModel({
        _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
        classes: req.body.classes,
        name: req.body.name,
        type: req.body.type,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isPublic: req.body.isPublic,
        address: req.body.address,
        country: req.body.country,
        photoUrl: req.body.photoUrl,
        since: req.body.since,
        bio: req.body.bio,
    })
    School.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: `You just created a school!`,
                createdSchool: {
                    _id: result._id,
                    name: result.name,
                    type: result.type,
                    phoneNumber: result.phoneNumber,
                    email: result.email,
                    isPublic: result.isPublic,
                    address: result.address,
                    country: result.country,
                    photoUrl: result.photoUrl,
                    since: result.since,
                    bio: result.bio,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:8000/schools/' + result._id
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


//Etablissement/:id
//GET SCHOOL
router.get('/:schoolId', (req, res, next) => {
    const id = req.params.schoolId
    SchoolModel.findById(id)
        .select('_id classes name type phoneNumber email isPublic address country photoUrl since bio')
        .populate('classes', 'name')
        .exec()
        .then(doc => {
                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        classes: doc.classes,
                        name: doc.name,
                        type: doc.type,
                        phoneNumber: doc.phoneNumber,
                        email: doc.email,
                        isPublic: doc.isPublic,
                        address: doc.address,
                        country: doc.country,
                        photoUrl: doc.photoUrl,
                        since: doc.since,
                        bio: doc.bio,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/schools/' + doc._id
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

//PATCH SCHOOL
router.patch('/:schoolId', (req, res, next) => {
    const id = req.params.schoolId
    SchoolModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this school\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/schools' + id
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

//DELETE SCHOOL
router.delete('/:schoolId', (req, res, next) => {
    const id = req.params.schoolId
    SchoolModel.findById(id)
    .exec()
    .then(doc => {
        if(!doc) {
            return res.status(404).json({
                message: 'School not found'
            })
        }
        //deleting classes, subjects and sessions
        doc.classes.forEach(dependent => {
          axios.delete(`http://localhost:8000/classes/${dependent}`)
            .then(result => console.log(`just deleted ${dependent}`))
        })
    })
    SchoolModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'School succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/schools/',
                    accepts: {
                        _id: 'ObjectId',
                        name: 'String',
                        type: 'String',
                        phoneNumber: 'String',
                        email: 'String',
                        isPublic: 'Boolean',
                        address: 'String',
                        country: 'String',
                        photoUrl: 'String',
                        since: 'Date',
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
