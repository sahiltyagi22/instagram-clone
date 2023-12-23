const express = require('express')
const path = require('path')
const app = express()

const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const expressSession = require('express-session')

const userModel = require('./models/userModel')
const indexRoutes = require('./routes/indexRoutes')



app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use(express.static(path.join(__dirname , 'public')))

app.use(
    expressSession({
      resave: false,
      saveUninitialized: false,
      secret: "this is a secret",
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(userModel.serializeUser());
  passport.deserializeUser(userModel.deserializeUser());
  passport.use(new localStrategy(userModel.authenticate()));



app.use('/' , indexRoutes)






module.exports = app
