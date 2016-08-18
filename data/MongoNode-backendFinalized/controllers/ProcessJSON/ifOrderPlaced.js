module.exports = function(json) {
  if(json['orderId'] == null){
   return "Placed";
  }
  else{
   return "Not Placed";
  }
}
