const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

const { alreadyLogged, loginCheck } = require('./middlewares');

router.get('/login', alreadyLogged(), (req, res, next) => {
  res.render('auth/login');
});

router.get('/signup', alreadyLogged(), (req, res, next) => {
  res.render('auth/signup');
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    passReqToCallback: true,
  })
);

// if you need more control and also want to set an error message
// router.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, theUser, failureDetails) => {
//     console.log('Inside passport.authenticate', err, theUser, failureDetails);
//     if (err) {
//       // Something went wrong authenticating user
//       return next(err);
//     }
//     if (!theUser) {
//       // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
//       return res.render('auth/login', {
//         message: 'Wrong password or username',
//       });
//     }
//     // save user in session: req.user
//     req.login(theUser, (err) => {
//       if (err) {
//         // Session save went bad
//         return next(err);
//       }
//       // All good, we are now logged in and `req.user` is now set
//       res.redirect('/');
//     });
//   })(req, res, next);
// });

router.post('/signup', (req, res, next) => {
  const { username, password, email, fullName } = req.body;
  if (password.length < 8) {
    return res.render('auth/signup', {
      message: 'Your password has to be 8 chars min',
    });
  }
  if (username === '' || email === '' || password === '' || fullName === '') {
    return res.render('auth/signup', {
      message: 'Please fill in all obligatory fields',
    });
  }
  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('auth/signup', { message: 'This username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username, email, fullName, password: hash }).then(
        (createdUser) => {
          req.login(createdUser, (err) => {
            if (err) {
              next(err);
            } else {
              res.redirect('/');
            }
          });
        }
      );
    }
  });
});

router.get('/private', loginCheck(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/auth/user', (req, res) => {
  if (req.user) {
    const { username, fullName, _id } = req.user;
    res.json({ username, fullName, _id });
  } else {
    res.json({ username: null });
  }
});

module.exports = router;
