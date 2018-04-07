var express = require('express');
var router = express.Router();

var helpers = require('../lib/helpers');
var User = require('../models/user.js');
var Product = require('../models/product.js');


router.get('/products', function(req, res, next){
    return Product.find({}, function(err, data) {
        if (err) {
            return next(err);
        } else {
            return res.render('products', {products: data, user: req.user});
        }
    });
});

router.get('/product/:id', function(req, res, next) {
    var productID = req.params.id;
    Product.findById(productID, function(err, data) {
        if(err) {
            return next(err);
        } else {
            if(!req.user) {
                req.flash('message', {
                    status: 'danger',
                    value: 'Please log in to Purchase!'
                });
            }
            return res.render('product', {
                product: data,
                user: req.user,
                message: req.flash('message')[0]
            });
        }
    });
});

router.get('/charge/:id', helpers.ensureAuthenticated, function(req, res, next) {
    var productID = req.params.id;
    return Product.findById(productID, function(err, data) {
        if (err) {
            return next(err);
        } else {
            return res.render('charge', {product: data, user: req.user});
        }
    });
});

router.get('/stripe', function(req, res, next) {
    res.send("Scram!");
});


module.exports = router;
