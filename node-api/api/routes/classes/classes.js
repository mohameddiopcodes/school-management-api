const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const ClassModel = require('../../models/classes/class')
const SchoolModel = require('../../models/classes/school')
const EducatorModel = require('../../models/classes/educator')
const SubjectModel = require('../../models/classes/subject')

//schools
router.get('/', (req, res, next) => {
    ClassModel.find()
        .select('_id school educators students subjects name year price photoUrl bio')
        .populate('school', 'name')
        .populate('educators', 'name')
        .populate('students', 'name')
        .populate('subjects', 'name')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                classes: docs.map(doc => {
                    return {
                        _id: doc._id,
                        school: doc.school,
                        educators: doc.educators,
                        students: doc.students,
                        subjects: doc.subjects,
                        name: doc.name,
                        year: doc.year,
                        price: doc.price,
                        photoUrl: doc.photoUrl,
                        bio: doc.bio,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/classes/' + doc._id
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

//schools/:id
router.get('/:classId', (req, res, next) => {
    const id = req.params.classId
    ClassModel.findById(id)
        .select('_id school educators students subjects name year price photoUrl bio')
        .populate('school', 'name')
        .populate('educator', 'name')
        .populate('students', 'name')
        // .populate('subjects', 'name')
        .exec()
        .then(doc => {
                if(doc) {
                    res.status(200).json({
                        _id: doc._id,
                        school: doc.school,
                        educators: doc.educators,
                        students: doc.students,
                        subjects: doc.subjects,
                        name: doc.name,
                        year: doc.year,
                        price: doc.price,
                        photoUrl: doc.photoUrl,
                        bio: doc.bio,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:8000/classes/' + doc._id
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

router.post('/for_school/:schoolId', (req, res, next) => {
    const schoolId = req.params.schoolId
    SchoolModel.findById(schoolId)
        .exec()
        .then(school => {
            if(!school) {
                return res.status(400).json({
                    message: 'School not found'
                })
            }

            const Class = new ClassModel({
                _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
                school: schoolId,
                name: req.body.name,
                year: req.body.year,
                price: req.body.price,
                photoUrl: req.body.photoUrl,
                bio: req.body.bio,
            })
            return Class
                .save()
                .then(result => {
                    //pushing class in the school
                    school.classes.push(result._id)
                    school
                        .save()
                        .then()
                        .catch(err => console.log(err))
    
                    res.status(202).json({
                        message: `You just created a class!`,
                        createdClass: {
                            _id: result._id,
                            school: result.school,
                            name: result.name,
                            year: result.year,
                            price: result.price,
                            photoUrl: result.photoUrl,
                            bio: result.bio,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/classes/' + result._id
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

router.post('/for_educator/:educatorId', (req, res, next) => {
    const educatorId = req.params.educatorId
    EducatorModel.findById(educatorId)
        .then(educator => {
            if(!educator) {
                return res.status(400).json({
                    message: 'Educator not found'
                })
            }

            const Class = new ClassModel({
                _id: mongoose.Types.ObjectId(mongoose.Types.ObjectId.index),
                students: req.body.students,
                subjects: req.body.subjects,
                name: req.body.name,
                year: req.body.year,
                price: req.body.price,
                photoUrl: req.body.photoUrl,
                bio: req.body.bio,
            })
            Class.educators.push(educatorId)
            return Class
                .save()
                .then(result => {
                    //pushing class in the educator
                    educator.classes.push(result._id)
                    educator
                        .save()
                        .then()
                        .catch(err => console.log(err))
    
                    res.status(202).json({
                        message: `You just created a class!`,
                        createdClass: {
                            _id: result._id,
                            school: result.school,
                            educators: result.educators,
                            students: result.students,
                            subjects: result.subjects,
                            name: result.name,
                            year: result.year,
                            price: result.price,
                            photoUrl: result.photoUrl,
                            bio: result.bio,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:8000/classes/' + result._id
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

router.patch('/:classId', (req, res, next) => {
    const id = req.params.classId
    ClassModel.update({_id: id}, {$set: req.body})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'You just updated this class\'s information!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:8000/classes/' + id
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

router.delete('/:classId', (req, res, next) => {
    const id = req.params.classId
    ClassModel.findById(id)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Class not found'
                })
            }

            //deleting classe's subjects
            doc.subjects.forEach(instance => {
                SubjectModel.findById(instance)
                    .exec()
                    .then(subject => {
                        if(subject.classes.length == 1 ) {
                            SubjectModel.deleteOne({_id: instance})
                                .exec()
                                .then(result => {
                                    console.log("Deleting Classe's Subject.....")
                                })
                                .catch(err => console.log(err))
                        } else {
                            console.log("Didn't delete classe's subjects because they depend on other classes")
                            res.status(500).json({message: "Subject depends on other classes"})
                        }
                    })
                    .catch(err => console.log(err))
            })
        })

    //deleting Class
    ClassModel.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Class succesfully deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:8000/classes/',
                    accepts: {
                        _id: 'ObjectId',
                        school: 'ObjectId',
                        educators: 'ObjectId',
                        students: 'ObjectId',
                        subjects: 'ObjectId',
                        name: 'String',
                        year: 'String',
                        price: 'Number',
                        photoUrl: 'String',
                        bio: 'String',
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