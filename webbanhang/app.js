var createError = require('http-errors');
var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');
var logger = require('morgan');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;



// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'khuyenhoa';


// Passport session setup. 
passport.serializeUser(function(user, done) {
  // console.log(user);
  
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
  clientID: "372176137105216",
  clientSecret: "d307b99e068a9d0f896aa38da71a1906",
  callbackURL: "http://localhost:3000/auth/fb/cb",
  profileFields: ["email", "displayName","gender","locale"]
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    // console.log(accessToken, refreshToken, profile, done);
    // console.log(profile);
    var newUser = {
      id: profile._json.id,
      displayName: profile._json.name,
      email: profile._json.email
    }
    const findDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('nguoidung');
      // Find some documents
      collection.find({'id': profile._json.id}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("tìm thấy bản ghi sau");
        // console.log(docs);
        if(docs.length == 0){
          const insertDocuments = function(db, callback) {
            // Get the documents collection
            const collection = db.collection('nguoidung');
            // Insert some documents
            collection.insert(newUser, function(err, result) {
              assert.equal(err, null);
              console.log("Thêm dữ liệu thành công");
              callback(result);
            });
          }
          MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            const db = client.db(dbName);
          
            insertDocuments(db, function() {
              client.close();
            });
          });
        }
        callback(docs);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
    
      findDocuments(db, function() {
        client.close();
      });
    });
    return done(null, profile);
  });
}
));
// Passport Google
passport.use(new GoogleStrategy({
  clientID: '748151796476-rl2er5nvs2tqa42sidr5d27pu9qa45dd.apps.googleusercontent.com',
  clientSecret: 'S6t6qRvbsEyy8jBI8qzYpY18',
  callbackURL: "http://localhost:3000/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


// Passport Local
passport.use(new LocalStrategy(
  function(username, password, done) {

    const findDocuments = function(db, callback) {
      const collection = db.collection('nguoidung');
      collection.findOne({ displayName: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.password != password) {
            return done(null, false);
        }
          return done(null, user);
      });
    }
    MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      const db = client.db(dbName);
    
      findDocuments(db, function() {
        client.close();
      });
    });
    
  }
));




var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// passport.use(new GoogleStrategy());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
  secret: 'ducpham',
  resave: false,
  saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
