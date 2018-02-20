/**
 * Created by PranavJain on 2/20/17.
 */
var express = require('express');
var router = express.Router();

var passport = require('../../lib/auth');
var helpers = require('../../lib/helpers');
var redis = require('../../lib/redis');
// using redis, create, edit and delete tabs
//(todo) set up authentication for each merchant to access redis (NO ONE ELSE)

//commands for redis
/*
create
(create)
 HMSET tab:MerchantID.UserID userID "<UserID>" merchantID "<MerchantID>" tabTotal <total tab money spent> Products "[{productID: \"product3\", name: \"product3\", time: { type: Date, default: Date.now }}]"

    (add to running list) so its searchable...
    SADD tabs:MerchantID MerchantID.UserID

 (get)
 HMGET tab:MerchantID.UserID tabTotal merchantID Products etc.

(search for tabs that are associated with a merchant)
 SSCAN tabs 0 MATCH MerchantID*

 (delete)
  DEL tab:MerchantID.UserID
    (delete from running list) so its no longer searched...
    SREM users "MerchantID.UserID"

    tabs: {
        MerchantID : {
            userID1 : {
                userID: "",
                merchantID: "",
                tabTotal: 0,
                numProducts: 0,
                Products: [
                    {
                        productID: "",
                        name: "",
                        time: "Date.now"
                    },
                    {
                        productID: "",
                        name: "",
                        time: "Date.now"
                    }
                ]
            },
            userID2 : {
                userID: "",
                merchantID: "",
                tabTotal: 0,
                numProducts 0,
                Products: [
                    {
                        productID: "",
                        name: "",
                        time: "Date.now"
                    },
                    {
                        productID: "",
                        name: "",
                        time: "Date.now"
                    }
                ]
            }
        }
    }





 */

//Todo: set up failsafes for all methods!!!!

//authorization functions
const requireAuth = passport.authenticate('user-mobile', { session: false });
//all functions with "requireAuth" used to have helpers.ensureAuthenticated

//open Tab localhost:3000/tabs/setup/:id <- id is for Pi id
router.post('/setup', helpers.ensureOAuthenticated,
    function(req, res, next) {
        //var store = new Store({
        //    'name': req.body.name,
        //    'description': req.body.description,
        //});
        var userID = req.user._id.toString();
        var merchantID = req.body.id;
        console.log("OPENING TAB WITH USER: " + userID + "\n and MERCHANT: " + merchantID);
        var tabKey = "tab:" + merchantID + "." + userID;

        //todo: if redis.exists(tabkey) then throw danger error.
        //could mean that they are trying to override their currently open tab...
        //redis.hget(tabKey, "numProducts", function (err, reply) {
        redis.hgetall(tabKey, function (err, obj) {
            if(err){
                res.status(500)
                    .json({
                        status: 'error',
                        data: err,
                        message: 'Something went wrong'
                    });
            }else {
                console.log("This is what we found when checking if tab is already open");
                console.dir(obj);
                if (obj) {
                    res.status(200)
                        .json({
                            status: 'success',
                            data: obj,
                            message: 'Retrieved tab.'
                        });
                }else{
                    redis.hmset(tabKey, {
                        "userID": userID,
                        "merchantID": merchantID,
                        "tabTotal": 0.0,
                        "numProducts": 0

                    }, function(err, reply) {
                        // reply is null when the key is missing
                        if(err){
                            return next(err);
                        }else {
                            console.log("Successfully opened tab!");
                            res.status(200)
                                .json({
                                    status: 'success',
                                    data: reply,
                                    message: 'Created tab.'
                                });
                            //test output
                            redis.hgetall(tabKey, function (err, obj) {
                                console.dir(obj);
                            });
                        }
                    });
                }
            }
        });


        var tabsMember = merchantID + "." + userID;
        var merchantTabs = "tabs:" + merchantID;
        redis.sadd(merchantTabs, tabsMember, function(err, reply) {
            if(reply){
                console.log("Successfully added tabID to set.");
            }
        });

        //test output
        redis.smembers(merchantTabs, function(err, reply) {
            console.log(reply);
        });

    });

//increment counter to tab of rfid: https://redis.io/commands/hincrby
router.post('/add', function(req, res, next) {
        //var store = new Store({
        //    'name': req.body.name,
        //    'description': req.body.description,
        //});
        var piID = req.body.piid.toString();
        var userRFID = req.body.id;
        console.log("Scanned RFID: " + userRFID + "\n with pi ID: " + piID);

        //todo: if redis.exists(tabkey) then throw danger error.
        //could mean that they are trying to override their currently open tab...
        //redis.hget(tabKey, "numProducts", function (err, reply) {
        redis.HINCRBY(userRFID, "counter", 1, function (err, obj) {
            if(err){
                res.status(500)
                    .json({
                        status: 'error',
                        data: err,
                        message: 'Something went wrong'
                    });
            }else {
                console.log("Incrementing counter for # times RFID has been scanned");
                console.dir(obj);
                if (obj) {
                    res.status(200)
                        .json({
                            status: 'success',
                            data: obj,
                            message: 'Incremented Tab.'
                        });
                }else{
                    res.status(500)
                        .json({
                            status: 'error',
                            data: obj,
                            message: 'Something went wrong'
                        });
                }
            }
        });




    });



/*
keys   for index 0
 Products.0.productID = ProductID
 Products.0.time = Date.now
 */


//get all tabs w/ merchantID
//what information should we return?
router.post('/getall', helpers.ensureMerchantAuthenticated,
    function(req, res, next) {

        var merchantID = req.user._id.toString();

        //this is the index number of the item we would like to remove from the tab

        console.log("Getting all tabs for MERCHANT: " + merchantID);

        var tabsKey = "tabs:" + merchantID;
        redis.smembers(tabsKey, function (err, reply) {
            if(err){
                return next(err);
            }
            else {
                var allTabs = reply;
                console.log("All tabs: " + allTabs);
                res.status(200)
                    .json({
                        status: 'success',
                        data: allTabs,
                        message: 'Retrieved all tabs from merchant.'
                    });
            }
        });


    });


//get tab info for user w/ userID like tabTotal and products bought
//passing in merchantID for this specific user
router.get('/tab/:id', requireAuth,
    function(req, res, next) {

        var userID = req.user._id.toString();
        var merchantID = req.params.id;
        //this is the index number of the item we would like to remove from the tab

        var tabKey = "tab:" + merchantID + "." + userID;
        //test output
        redis.hgetall(tabKey, function (err, obj) {
            if(err){
                return next(err);
            }else {
                console.dir(obj);
                res.status(200)
                    .json({
                        status: 'success',
                        data: obj,
                        message: 'Retrieved tab.'
                    });
            }
        });


    });

//get User for merchant to populate information on bartender dashboard
//passing in userID
router.get('/user/:id', helpers.ensureMerchantAuthenticated,
    function(req, res, next) {

        var merchantID = req.user._id.toString();
        var userID = req.params.id;
        //this is the index number of the item we would like to remove from the tab

        var tabKey = "tab:" + merchantID + "." + userID;
        //test output
        redis.hgetall(tabKey, function (err, obj) {
            if(err){
                return next(err);
            }else {
                console.dir(obj);
                res.status(200)
                    .json({
                        status: 'success',
                        data: obj,
                        message: 'Retrieved tab.'
                    });
            }
        });


    });





//close tab
router.post('/close', helpers.ensureOAuthenticated,
    function(req, res, next) {
        //var store = new Store({
        //    'name': req.body.name,
        //    'description': req.body.description,
        //});
        var userID = req.user._id.toString();
        var merchantID = req.body.id;
        console.log("CLOSING TAB WITH USER: " + userID + "\n and MERCHANT: " + merchantID);


        var tabKey = "tab:" + merchantID + "." + userID;

        redis.hgetall(tabKey, function (err, tab) {
            if(err || !tab){
                return next(err);
            }else {
                console.dir(tab);


            }
        });


    });

module.exports = router;
