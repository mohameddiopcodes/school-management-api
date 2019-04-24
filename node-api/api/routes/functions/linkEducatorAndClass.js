const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
const EducatorModel = require('../../models/classes/educator')
const ClassModel = require('../../models/classes/class')

router.post('/:classId/:educatorId', (req, res, next) => {
    const classId = req.params.classId
    const educatorId = req.params.educatorId
    ClassModel.findById(classId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Class not found'
                })
            }
            //if educator is not in array findIndex returns a negative number
            const educatorExists = doc.educators.findIndex(result => {return result == educatorId})
            if(educatorExists >= 0) {
                return res.status(404).json({
                    message: 'Educator already exists in Class object'
                })
            }
            doc.educators.push(educatorId)
            doc.save()
        })
        .catch(err => console.log(err))

    EducatorModel.findById(educatorId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Educator not found'
                })
            }
            //if class is not in array findIndex returns a negative number
            const classExists = doc.classes.findIndex(result => {return result == classId})
            if(classExists >= 0) {
                return res.status(404).json({
                    message: 'Class already exists in Educator object'
                })
            }
            doc.classes.push(classId)
            doc.save()
            return res.status(200).json({
                message: 'Educator succesfully added to Class',
                educator: doc
            })
        })
        .catch(err => console.log(err))
})

module.exports = router