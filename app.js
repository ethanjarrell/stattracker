const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const Activity = require('./models/activity');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');
const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());

mongoose.Promise = require('bluebird');


mongoose.connect('mongodb://localhost:27017/stats');

//Authentication Section
passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user){
      // console.log("Here is the User " + user);
      if (user && bcrypt.compareSync(password, user.password)){
        return done(null, user);
      }
      return done(null, false);
    });
  }
));

// var user = User.findOne({username: "Ethan"}, function(err, user){
//   user.password = 'test';
//   user.save(function(err){
//     if (err) {return console.log('user not saved')}
//     console.log('user saved!')
//   })
// });

app.get('/api/auth',
  passport.authenticate('basic', {session: false}), function (req, res) {
      res.send('You have been authenticated, ' + req.user.username);
  }
);
//End of Authentication Section

//Place holder if you don't go to the correct endpoint to start
app.get('/', function(req, res){
  res.send('Please use /api/...');
});
//End of place holder


//Authentication to endpoint, just returns "You have been authenticated"
app.get('/api/auth',
  passport.authenticate('basic', {session: false}), function (req, res) {
      res.send('You have been authenticated, ' + req.user.name);
  }
);
//End of authentication endpoint


app.use(function(req, res, next){
  console.log('we use the router, and next moves to the next requests');
  next();
})

//Show a list of all activities I am tracking, and links to their individual pages

app.get('/api/activities', passport.authenticate('basic', {session: false}), function(req, res){
  console.log('get activities');
  Activity.find().then(function(activities){
    res.render('allActivities', {
    activities: activities,
    })
});
});

//Create a new activity for me to track.

app.post('/api/activities', passport.authenticate('basic', {session: false}), function(req, res){

  Activity.create({
    activity_name: req.body.activity_name,
    quantity: req.body.quantity
  }).then(activity =>{
    res.redirect('/api/activities')
  });
});

//Show information about one activity I am tracking, and give me the data I have recorded for that activity.

app.get('/api/activities/id/:id', passport.authenticate('basic', {session: false}), function(req, res){

  Activity.findById().then(function(activities){
    res.render('singleActivity', {activities: activities});
})
})

//Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.


app.put('/api/activities/:activity_id', passport.authenticate('basic', {session: false}), function(req, res){

  Activity.findOneAndUpdate({
    activity_name: req.body.activity_name,
    quantity: req.body.quantity,
  }).then(activity =>{
    res.json(activity)
  });
});

//Delete one activity I am tracking. This should remove tracked data for that activity as well.

app.delete('/api/activities/:activity_id', passport.authenticate('basic', {session: false}), function(req, res){

  Activity.findOneAndRemove({
    activity_name: req.body.activity_name,
    quantity: req.body.quantity,
  }).then(activity =>{
    res.json(activity)
  });
});

//get all activities by a specific date

app.get('/api/activities/date/:date', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.find(req.params.date).then(function(err, activity){
    if (err){
    res.send(err)
  }
  res.json(activity)
  })
})

//Update stats to a specific date and ID

app.put('/api/activities/addtodate/:activity_id/:date', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.findOneAndUpdate({
    activity_name: req.body.activity_name,
    quantity: req.body.quantity,
  }).then(activity =>{
    res.json(activity)
  });
});

//Delete stats for a specific day and ID

app.delete('/api/activities/deletefromdate/:activity_id/:date', passport.authenticate('basic', {session: false}), function(req, res){
  Activity.findOneAndRemove({
    activity_name: req.body.activity_name,
    quantity: req.body.quantity,
  }).then(activity =>{
    res.json(activity)
  });
});


app.listen(3000);
console.log('starting applicaiton.  Good job!');

module.exports = app;
