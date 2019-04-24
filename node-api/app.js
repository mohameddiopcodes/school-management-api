//requiring packages and setting up
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}))
const morgan = require('morgan')
const mongoose = require('mongoose')

//connection to mongodb database
mongoose.connect('mongodb://mongo:27017/school_project', {useNewUrlParser: true})
    .catch(err => console.log(err))
mongoose.Promise = global.Promise

//putting routes for models into variables
const schoolsRoutes = require('./api/routes/classes/schools')
const educatorsRoutes = require('./api/routes/classes/educators')
const studentsRoutes = require('./api/routes/classes/students')
const classesRoutes = require('./api/routes/classes/classes')
const subjectsRoutes = require('./api/routes/classes/subjects')
const sessionsRoutes = require('./api/routes/classes/sessions')
const parentsRoutes = require('./api/routes/classes/parents')

//putting routes for functions into variables
const linkStudentAndClassRoutes = require('./api/routes/functions/linkStudentAndClass')
const linkStudentAndParentRoutes = require('./api/routes/functions/linkStudentAndParent')
const linkEducatorAndClassRoutes = require('./api/routes/functions/linkEducatorAndClass')



//morgan
app.use(morgan('dev'))

//Middlewares listening to requests and forwarding them to routes
//models
app.use('/schools', schoolsRoutes)
app.use('/educators', educatorsRoutes)
app.use('/students', studentsRoutes)
app.use('/classes/', classesRoutes)
app.use('/subjects', subjectsRoutes)
app.use('/sessions', sessionsRoutes)
app.use('/parents', parentsRoutes)
//functions
app.use('/functions/link_student_and_class', linkStudentAndClassRoutes)
app.use('/functions/link_student_and_parent', linkStudentAndParentRoutes)
app.use('/functions/link_educator_and_class', linkEducatorAndClassRoutes)

//handling errors
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app