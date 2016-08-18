var getName       = require('./getName');
var getVersion    = require('./getVersion');
var getItemsCount = require('./getItemsCount');
var ifOrderPlaced = require('./ifOrderPlaced');
var getCity       = require('./getCity');

module.exports = function(JSONarray){
 var list = "";
 var name;
 var version;
 var itemsCount;
 var orderPlaced;
 var city;

 for (var i=0; i<JSONarray.length; i++)
   {
    // array_orderId += (todos[i]['orderId'] + "");
    // if(JSONarray[i]['orderId'] == null){
    name          = getName(JSONarray[i]);
    version       = getVersion(JSONarray[i]);
    itemsCount    = getItemsCount(JSONarray[i]);
    orderPlaced   = ifOrderPlaced(JSONarray[i]);
    city          = getCity(JSONarray[i]);
    list         += "\n\nName:  " + name + "\n\t Version: " + version + "\n\t itemsCount: " +
            itemsCount + "\n\t Was order placed?: " + orderPlaced + "\n\t City: " + city;
   }

 return(list);
}
