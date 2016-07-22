var Model = require('../models/model');

module.exports = function(app) {

   app.get('/create', function(req, res) {

       // seed database
       var starterModel = [
        {
            orderId: '12121'
        },
        {
            orderId: '12122'
        },
        {
            orderId: '12123'
        }
       ];
       Model.create(starterModel, function(err, results) {
           res.send(results);
       });
   });

}
