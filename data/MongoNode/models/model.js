var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
 'orderId'                 : String,
 'buyerInfo'               : JSON,
 'purchaseContractLocation': JSON,
 'version'                 : String,
 'purchaseContractItems'   : JSON,
 'createdDate'             : String,
 'itemCount'               : Number
},{ collection: 'data' });


var model = mongoose.model('data', Schema);

module.exports = model;
