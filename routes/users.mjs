import path from "node:path";
import util from "node:util"
import { Router } from "express";
import { default as passport } from "passport";
import { default as passportLocal } from "passport-local";
import debug from "debug";
import * as usersModel from '../models/user-superagent.mjs';
import { sessionCookieName } from '../app.mjs';

export const router = Router();
const LocalStrategy = passportLocal.Strategy;

export function initPassport(app) {
  app.use(passport.initialize());
  app.use(passport.session());
}

export function ensureAuthenticated(req, res, next) {
  if (req.user) next();
  else res.redirect('/users/login');
}

router.get('/login', (req, res, next) => {
  res.render('login', { title: "Login to Notes", user: req.user });
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/logout',async (req, res, next) => {
  try {
    req.logOut((err) => {
      if (err) next(err)
      req.session.destroy();
      res.clearCookie(sessionCookieName) ; 
      res.redirect('/')
    })
  } catch (error) {
    next(error)
  }
})

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    let check = await usersModel.passwordCheck(username, password);
    if (check.check) {
      done(null, { username: check.username, id: check.username })
    } else {
      done(null, false, {message: check.message})
    }
  } catch (error) {
    done(error)
  }
}))

passport.serializeUser((user, done) => {
  try {
    if (user) {
      done(null, user.username)
    }
  } catch (error) {
    done(error)
  }
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersModel.find(id);
    done(null, user)
  } catch (error) {
    done(error)
  }
})
