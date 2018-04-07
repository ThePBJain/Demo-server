var express = require('express');
var router = express.Router();
var mongoose = require('mongoose-q')(require('mongoose'));

var passport = require('../../lib/auth');
var helpers = require('../../lib/helpers');
var User = require('../../models/user');


// ** users ** //

// get ALL users
router.get('/users', ,
    function(req, res, next) {
        /*implement*/
    });

// get SINGLE user
router.get('/users/:id',
    function(req, res, next) {
        /*implement*/
    });

// add new user
router.post('/users',
    function(req, res, next) {
        /*implement*/
    });

// update SINGLE user
router.put('/users/:id',
    function(req, res, next) {
        /*implement*/
    });

// delete SINGLE user
router.delete('/users/:id',
    function(req, res, next) {
        /*implement*/
    });


module.exports = router;
