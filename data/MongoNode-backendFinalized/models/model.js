var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
 'orderId'                 : String,
 'buyerInfo'               : JSON,
 'purchaseContractLocation': JSON,
 'version'                 : String,
 'purchaseContractItems'   : JSON
},{ collection: 'data' });


var model = mongoose.model('data', Schema);

module.exports = model;
