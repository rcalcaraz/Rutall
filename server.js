
    // set up ========================
    var express         = require('express');
    var app             = express();                         // create our app w/ express
    var mongoose        = require('mongoose');               // mongoose for mongodb
    var methodOverride  = require('method-override'); 		 // simulate DELETE and PUT (express4)
     
    var morgan          = require('morgan');                 // log requests to the console (express4)
    var cookieParser    = require('cookie-parser');
    var bodyParser      = require('body-parser');            // pull information from HTML POST (express4)

    var configDB        = require('./config/database.js');

    // load up the user and route models
    var User            = require('./app/model/user.js');
    var Route           = require('./app/model/route.js');

    // configuration =================
    mongoose.connect(configDB.url); // connect to our database

    // set up our express application
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(express.static(__dirname + '/www'));                    // set the static files location /public/img will be /img for users
    app.use(methodOverride());
    
	// api users ===================
    // api ---------------------------------------------------------------------
    // get all users
    app.get('/api/users',function(req,res){
    	User.find(function(err,users){
    	if(err) res.send(err);
    	res.json(users);
    	});
    });

    // get one user
    app.get('/api/users/:email',function(req,res){
        User.findOne({ email: req.params.email }, function (err, user) {
            if(err) res.send(err);
            res.json(user);
        });
    });   

    // create user and send back all after creation
    app.post('/api/users',function(req,res){
    	User.create({
    		email : req.body.email,
    		password : req.body.password
    	}, function(err,user){
    		if(err) res.send(err);
    		User.find(function(err,users){
    			if(err) res.send(err);
    			res.json(users);
    		});
    	});
    });	 

    // api routes ===================
    // api ---------------------------------------------------------------------
    // get all routes
    app.get('/api/routes',function(req,res){
        Route.find(function(err,routes){
        if(err) res.send(err);
        res.json(routes);
        });
    });

     // get routes by creator
    app.get('/api/routes/creator/:creator',function(req,res){
        Route.find({ _creator: req.params.creator }, function (err, route) {
            if(err) res.send(err);
            res.json(route);
        });
    });   

    // get one route
    app.get('/api/routes/:id',function(req,res){
        Route.findOne({ _id: req.params.id }, function (err, route) {
            if(err) res.send(err);
            res.json(route);
        });
    });   

    // create route and send back all after creation
    app.post('/api/routes',function(req,res){
        Route.create({
            _creator        : req.body.creator,
            name            : req.body.name,
            time            : req.body.time,
            distance        : req.body.distance,
            consumption     : req.body.consumption,
            locations       : req.body.locations
        }, function(err,route){
            if(err) res.send(err);
            Route.find(function(err,routes){
                if(err) res.send(err);
                res.json(routes);
            });
        });
    });      

   // application ---------------------------------------------------------------------
    app.get('*',function(req,res){
    	res.sendfile('./www/index.html');
    });

 	// listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");


   

    
