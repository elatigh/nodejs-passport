const express = require('express');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')

const profilRoute= require('./routes/profile-route')


const app = express();

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}))
// init passport
app.use(passport.initialize())
app.use(passport.session())
// set view engine
app.set('view engine', 'ejs');

// set up routes
app.use('/auth', authRoutes);
app.use('/profile',profilRoute)
// connect to mongodb
mongoose.connect(keys.mongodb.url,{useNewUrlParser: true})
.then(result=>console.log('you are connected'))
.catch(err=>console.log('error'))
// create home route
app.get('/', (req, res) => {
    res.render('home',{user:req.user});
});

app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});
