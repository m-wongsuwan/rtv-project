const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const { expressjwt: jwt } = require('express-jwt')

app.use(express.json())
app.use(morgan('dev'))

mongoose.connect(
    'mongodb://localhost:27017/rtv-project-db',
    () => console.log('Connected to the database')
)

app.use('/auth', require('./routes/authRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    // Unauthorized error goes here 
    return res.send({errMsg: err.message})
})

app.listen(6968, ()=> {
    console.log('Server is up on local port 6968')
})