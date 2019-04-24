const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')
const StudentModel = require('../../models/classes/student')
const ParentModel = require('../../models/classes/parent')

router.post('/:parentId/:studentId', (req, res, next) => {
    const parentId = req.params.parentId
    const studentId = req.params.studentId
    ParentModel.findById(parentId)
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: 'Parent not found'
                })
            }
            //if student is not in array findIndex returns a negative number
            const studentExists = doc.students.findIndex(result => {return result == studentId})
            if(studentExists >= 0) {
                return res.status(404).json({
                    message: 'Student already exists in Parent object'
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
            //if parent is not in array findIndex returns a negative number
            const parentExists = doc.parents.findIndex(result => {return result == parentId})
            if(parentExists >= 0) {
                return res.status(404).json({
                    message: 'Parent already exists in Student object'
                })
            }
            doc.parents.push(parentId)
            console.log(doc.parents)
            doc.save()
            return res.status(200).json({
                message: 'Student succesfully added to Parent',
                student: doc
            })
        })
        .catch(err => console.log(err))
})

module.exports = router