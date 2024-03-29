//setting up
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const SchoolModel = require('../../models/classes/school')
const ClassModel = require('../../models/classes/class')
const axios = require('axios')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const checkAuth = require("../../middleware/checkAuth")

//Etablissements
//GET SCHOOLS
router.get('/', checkAuth, (req, res, next) => {
    SchoolModel.find()
        .select('_id classes name type phoneNumber email password isPublic address country photoUrl since bio')
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
                        password: doc.password,
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

//signup
router.post('/signup', (req, res, next) => {
   SchoolModel.findOne({email: req.body.email})
    .exec()
    .then(result => {
      if(result) {
        return res.status(500).json({
          message: 'email already exists'
        })
      }
      bcrypt.hash(req.body.password, 10, (err, hashed) => {
        if (err){
          return res.status(500).json({
            error: err
          })
        } else {
          //saving school
          const School = new SchoolModel({
              _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
              classes: req.body.classes,
              name: req.body.name,
              type: req.body.type,
              phoneNumber: req.body.phoneNumber,
              email: req.body.email,
              password: hashed,
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
                          password: result.password,
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
          }
       })
    })
})

//login
router.post('/login', (req, res, next) => {
  SchoolModel.findOne({email: req.body.email})
    .exec()
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      bcrypt.compare(req.body.password, result.password, (err, response) => {
        if(err) {
          return res.status(401).json({
            message: "Auth failed"
          })
        }
        if(response) {
          const token = jwt.sign({email: result.email, id: result.id}, process.env.JWT_KEY, {expiresIn: "1h"})
          return res.status(200).json({
            message: "Auth successfull",
            token: token
          })
        }
        return res.status(401).json({
          message: "Auth failed"
        })
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
router.get('/:schoolId', checkAuth, (req, res, next) => {
    const id = req.params.schoolId
    SchoolModel.findById(id)
        .select('_id classes name type phoneNumber email password isPublic address country photoUrl since bio')
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
                        password: doc.password,
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
router.patch('/:schoolId', checkAuth, (req, res, next) => {
    const id = req.params.schoolId
    //a revoir
    SchoolModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this school\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/schools/' + id
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
router.delete('/:schoolId', checkAuth, (req, res, next) => {
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
            .catch(err => console.log(err))
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
                        password: 'String',
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
