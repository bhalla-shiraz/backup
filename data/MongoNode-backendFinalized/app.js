// get Express
var express = require('express');

//start express
var app = express();

//interact DB and node
var mongoose = require('mongoose');


var config = require('./config');
var setupController = require('./controllers/setupController');
var apiController = require('./controllers/apiController');

var port = process.env.PORT || 3000;

//on use with browser - front end
app.use('/assets', express.static(__dirname + '/public'));

//Server side templating
app.set('view engine', 'ejs');


// DB object connect
mongoose.connect(config.getDbConnectionString());
// mongoose.connection.once('open', function(){
//
//   app.listen(3000);
// });
setupController(app);
apiController(app);

port = 3000
app.listen(port);
