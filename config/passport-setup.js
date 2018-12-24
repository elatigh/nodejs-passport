const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user.model')

passport.serializeUser((user,done)=>{
  done(null,user.id)
})
passport.deserializeUser((id,done)=>{
  User.findById(id)
  .then((user)=>{
    done(null,user)
  })
})

passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
         User.findOne({googleId:profile.id})
         .then(currentUser=>{
           if(currentUser){
             console.log(currentUser)
             done(null,currentUser)
           }else{
             new User({
               userName:profile.displayName,
               googleId:profile.id,
               thumbnail:profile._json.image.url
            }).save().then(newuser=>{
              console.log(newuser)
              done(null,newuser)
            })
           }
         })

        // passport callback function
        console.log('passport callback function fired:');
        //console.log(profile);
    })
);
