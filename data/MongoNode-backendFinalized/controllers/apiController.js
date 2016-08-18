var Model = require('../models/model');
var bodyParser = require('body-parser');
var getName = require('./ProcessJSON');


module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/data', function(req, res) {

        Model.find({}, function(err, model) {
            if (err) throw err;

            var arr = Object.keys(model);
            var array_orderId = [];
            // res.send(arr.length + "");



            var count_placed = 0;
            var count_total = 0;
            //get counts
            for (var i=0; i<model.length; i++)
              {
               // array_orderId += (todos[i]['orderId'] + "");
               if(model[i]['orderId'] == null){
                console.log("null");
               }
               else{
                count_placed++;
               }
              }
              count_total = model.length;

              res.header("Content-Type", "application/json");
              res.send(getName(model));


            // res.send("Total Sessions  :" + count_total + "\nTotal Placed  :" + count_placed );
        });

    });


    app.get('/placed', function(req, res) {

        Model.find({"orderId" : {$exists: true}}, function(err, model) {
            if (err) throw err;

            var arr = Object.keys(model);
            res.header("Content-Type", "application/json");
            res.send(arr.length + "");
            // res.send(todos);
        });

    });




}
