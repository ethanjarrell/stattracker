const express = require('express');
const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mustacheExpress = require('mustache-express');
const Activity = require('./models/activity');
const uniqueValidator = require('mongoose-unique-validator');
const Category = require('./models/category');
const User = require('./models/user.js');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
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

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

mongoose.Promise = require('bluebird');


mongoose.connect('mongodb://localhost:27017/stats', { config: { autoIndex: false } });

//Authentication Section
passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      // console.log("Here is the User " + user);
      if (user && bcrypt.compareSync(password, user.password)) {
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
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {
    res.send('You have been authenticated, ' + req.user.username);
  }
);
//End of Authentication Section

//Place holder if you don't go to the correct endpoint to start
app.get('/', function(req, res) {
  res.redirect('/api/splash');
});
//End of place holder


//Authentication to endpoint, just returns "You have been authenticated"
app.get('/api/auth',
  passport.authenticate('basic', {
    session: false
  }),
  function(req, res) {
    res.send('You have been authenticated, ' + req.user.name);
  }
);
//End of authentication endpoint


app.use(function(req, res, next) {
  console.log('I dont like programming anymore');
  next();
})

//====RENDER SPLASHPAGE===//

app.get('/api/splash', passport.authenticate('basic', {
  session: false
}), function(req, res) {
        res.render('splash', {
        })
      });


//====POST SIGNUP PAGE===//

app.post('/api/signup',passport.authenticate('basic', {
  session: false
}), function(req, res) {
  const user = User.build({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })
  console.log(req.body);

  User.save().then(function(user) {
    req.username = user.username;
    req.session.authenticated = true;
    res.redirect('/api/login')
    console.log(req.session);
  })


})

//====RENDER SIGNUP PAGE===//

app.get('/api/signup', passport.authenticate('basic', {
  session: false
}), function(req, res) {
        res.render('signup', {
        })
      });
//====POST LOGIN PAGE===//

app.post('/api/login',passport.authenticate('basic', {
  session: false
}), function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.find({
      username: username,
      password: password
  }).then(user => {
    if (User.password == password) {
      req.session.username = username;
      req.session.userId = User.dataValues.id;
      req.session.authenticated = true;
      console.log(req.session);

      res.redirect('/api/home');
    } else {
      res.redirect('/api/login');
      console.log("This is my session", req.session)
    }
  })
})

//====RENDER LOGIN PAGE===//

app.get('/api/login',passport.authenticate('basic', {
  session: false
}), function(req, res) {
  if (req.session && req.session.authenticated) {
    var user = models.user.findOne({
      where: {
        username: req.session.username,
        password: req.session.password
      }
    }).then(function(user) {
      if (user) {
        req.session.username = req.body.username;
        req.session.userId = user.dataValues.id;
        let username = req.session.username;
        let userid = req.session.userId;
        res.render('index', {
          user: user
        });
      }
    })
  } else {
    res.redirect('/api/signup')
  }
})

//====POST LOGIN FOR USER===//

app.post('/api/login', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  User.create({
    activity_type: req.body.category,
  }).then(activity => {
    res.redirect('/api/home')
  });
});

//====CREATE NEW CATEGORY===//

app.post('/api/home', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  Category.create({
    activity_type: req.body.category,
    // activities: req.params,
  }).then(activity => {
    res.redirect('/api/home')
  });
});

//====RENDER HOME PAGE===//

app.get('/api/home', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  User.find({}).then(function(users) {
    Category.find({}).then(function(categories) {
      Activity.find({}).then(function(activities) {
        console.log(activities);
        res.render('home', {
          users: users,
          categories: categories,
          activities: activities,
        })
      });
    });
  });
});

//====CREATE ACTIVITY===//

app.post('/api/:activity/:_id', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  Activity.create({
    activity_name: req.body.activity,
    quantity: req.body.quantity,
    metric: req.body.metric,
    category: req.params.activity,
    // dates: req.params.activity
  }).then(activity => {
    console.log("about to log categories");
    res.redirect('/api/:activity/:_id')
  });
});

//====RENDER ACTIVITY PAGE===//

app.get('/api/:activity/:_id', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  User.find({}).then(function(users) {
    Category.findOne({activity_type: req.params.activity}).then(function(categories) { Activity.find({category: req.params.activity}).then(function(activities) {
        res.render('activity', {
          users: users,
          activities: activities,
        })
     });
    });
  });
});

//====RENDER SPECIFIC ACTIVITY===//

app.get('/api/:activity', passport.authenticate('basic', {
  session: false
}), function(req, res) {
  User.find({}).then(function(users) {
    Category.findOne({activity_type: req.params.activity}).then(function(categories) { Activity.find({ activity_name: req.params.activity
    }).then(function(activities) {
          res.render('date', {
            users: users,
            categories: categories,
            activities: activities
          })
      });
    });
  });
});


app.listen(3000);
console.log('starting applicaiton.  Good job!');

module.exports = app;
