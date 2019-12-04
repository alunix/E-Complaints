// E-Complaints
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")


const app = express()


// Middleware to Handle Post request
app.use(express.json());
app.use(express.urlencoded({ extended : true, limit : '50mb'}));


// Define paths for views and public dir
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../views');

// Set path for views and public directory
app.set('views', viewsDirectoryPath);
app.use(express.static(publicDirectoryPath));

// Ejs Engine
app.set('viewengine', 'ejs')


// Connect DB
mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to database'))
    .catch(err => console.error("Could not connect to MongoDB..."));

// Express session middleware 
app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true
}));

// Express flash message middleware
app.use(flash());
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});




// Routes
const homeRouter = require('../routes/index')
app.use(homeRouter)

const complaintRouter = require('../routes/complaints')
app.use(complaintRouter)

const feedbackRouter = require('../routes/feedback')
app.use(feedbackRouter)








const hostname = 'localhost'
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})