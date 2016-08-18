var Model = require('../models/model');
var bodyParser = require('body-parser');
var getName = require('./ProcessJSON');

function ConvertToCSV(objArray) {
   var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
   var str = '';

   for (var i = 0; i < array.length; i++) {
       var line = '';
       for (var index in array[i]) {
           if (line != '') line += ','

           line += array[i][index];
       }

       str += line + '\r\n';
   }
   console.log("str");
   return str;
}



module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // app.use(app.static(__dirname + '/public')); //
    app.get('/checkout',function(req, res){
     Model.find({}, function(err,model) {
      res.header("Content-Type", "application/json");
      res.json(model);
     });
    });

    app.get('/big',function(req, res){
     // Model.aggregate([{$group:{ "_id" : "$createdDate" }},{$sort:{_id:1}}]
     Model.aggregate([{"$group" : { _id:"$createdDate", counter:{ $sum:1},
     count:{ $sum: {$cond: {if: {$ifNull: [ "$orderId", false ]}, then: 1, else: 0}}}}}]


      , function(err,model) {
       // res.header("Content-Type", "application/json");
      res.header("Content-Type", "text/html");
      // res.send(model);
      // model.sort(function(a,b) {return a.date-b.date;});
      console.log("model");
     // res.send(model);
      res.send("date,total,close\r\n" + ConvertToCSV(model));
     });
    });

    app.get('/bigOld',function(req, res){
     // Model.aggregate([{$group:{ "_id" : "$createdDate" }},{$sort:{_id:1}}]
     Model.aggregate([{"$group" : { _id:"$createdDate",
     count:{ $sum: {$cond: {if: {$ifNull: [ "$orderId", false ]}, then: 1, else: 0}}}}}]


      , function(err,model) {
       // res.header("Content-Type", "application/json");
      res.header("Content-Type", "text/html");
      // res.send(model);
      // model.sort(function(a,b) {return a.date-b.date;});
      console.log("model");
     // res.send(model);
      res.send("date,close\r\n" + ConvertToCSV(model));
     });
    });

    app.get('/bigOlder',function(req, res){
     // Model.aggregate([{$group:{ "_id" : "$createdDate" }},{$sort:{_id:1}}]
     Model.aggregate([{"$group" : {_id:"$createdDate", count:{$sum:1}}}]


      , function(err,model) {
      // res.header("Content-Type", "application/json");
      res.header("Content-Type", "text/html");
      // res.send(model);
      // model.sort(function(a,b) {return a.date-b.date;});
     // res.send(model);
      res.send("date,close\r\n" + ConvertToCSV(model));
     });
    });

    app.get('/', function(req, res) {
      res.send("<h1> Welcome To Checkout Data Visualization Application </h2>"+
               "<h2> Go to Visualization - Please click <a href='/visual'>here</a> </h2>"+
               "<h2> Go to events - Please click <a href='/getEvents'>here</a> </h2>"+
               "<h2> Go to data - Please click <a href='/data'>here</a> </h2>"+
               "<h2> Go to placed info - Please click <a href='/placed'>here</a> </h2>"+
               "<h2> Go to json data PC - Please click <a href='/checkout'>here</a> </h2>");
    });

    app.get ('/tester', function(req, res) {
     res.send("this is a tester API");
    });
    app.get ('/events', function(req, res) {
     // var name = req.param('name');
     // var time = req.param('time');
     //
     // var fs = require('fs');
     //   fs.writeFile("/public/test.json", "Hey there!", function(err) {
     //   if(err) {
     //       console.log("err");
     //   }
     //   else{
     //    console.log("damn!!");
     //   }
     //  });
     //  res.send(name + " " + time);


     var fs = require("fs");

     // Asynchronous read
     fs.readFile(__dirname + '/test.json', function (err, data) {
        if (err) {
            return console.error("err1");
        }
        // res.send("read: " + data.toString());
     });

     fs.appendFile(__dirname + '/test.json', "\,{\"name\" : \"" + req.param('name') + "\", \"time\" : \"" + req.param('time') + "\"\}",  function (err, data) {
        if (err) {
            return console.error("err2");
        }

     });

     // fs.d
     fs.readFile(__dirname + '/test.json', function (err, data) {
        if (err) {
            return console.error("err3");
        }
        res.send("read: " + data.toString());
     });
     // res.send("Program Ended");

    });

    app.get('/getEvents', function(req, res){
     var fs = require("fs");

     fs.readFile(__dirname + '/test.json', function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString() + ']');
     });
    });

    app.get('/purchase', function(req, res) {
     Model.find({}, function(err, model) {
         if (err) throw err;

         var array_items = [];

         for (var i=0; i<model.length; i++)
           {
             array_items.push(model[i]['itemCount']);
             // console.log(model[i]['purchaseContractItems']);
           }
           res.header("Content-Type", "application/json");
           res.send(array_items);
    });
   });
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

        Model.find({}, function(err, model) {
          var count_placed = 0;
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


           res.header("Content-Type", "application/json");
           res.send(count_placed + "");


         // res.send("Total Sessions  :" + count_total + "\nTotal Placed  :" + count_placed );
        });
        //     if (err) throw err;
        //
        //     var arr = Object.keys(model);
        //     res.header("Content-Type", "application/json");
        //     res.send(arr);
        //     // res.send(todos);
        // });

    });

    app.get('/visual ', function(req, res) {
     res.sendfile('./public/index.html');
    });


    app.get('/sample', function(req, res){
     var fs = require("fs");

     fs.readFile(__dirname + '/data.csv', function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString());
     });
    });

    app.get('/sample1', function(req, res){
     var fs = require("fs");

     fs.readFile(__dirname + '/data1.csv', function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString());
     });
    });

    app.get('/sample2', function(req, res){
     var fs = require("fs");

     fs.readFile(__dirname + '/data2.csv', function (err, data) {
        if (err) {
            return console.error(err);
        }
        res.send(data.toString());
     });
    });

}
