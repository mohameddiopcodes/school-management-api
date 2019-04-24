const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
const StudentModel = require('../../models/classes/student')
const ClassModel = require('../../models/classes/class')

router.post('/:classId/:studentId', (req, res, next) => {
    const classId = req.params.classId
    const studentId = req.params.studentId
    ClassModel.findById(classId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Class not found'
                })
            }
            //if student is not in array findIndex returns a negative number
            const studentExists = doc.students.findIndex(result => {return result == studentId})
            if(studentExists >= 0) {
                return res.status(404).json({
                    message: 'Student already exists in Class object'
                })
            }
            doc.students.push(studentId)
            doc.save()
        })
        .catch(err => console.log(err))

    StudentModel.findById(studentId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Student not found'
                })
            }
            //if class is not in array findIndex returns a negative number
            const classExists = doc.classes.findIndex(result => {return result == classId})
            if(classExists >= 0) {
                return res.status(404).json({
                    message: 'Class already exists in Student object'
                })
            }
            doc.classes.push(classId)
            doc.save()
            return res.status(200).json({
                message: 'Student succesfully added to Class',
                student: doc
            })
        })
        .catch(err => console.log(err))
})

module.exports = router