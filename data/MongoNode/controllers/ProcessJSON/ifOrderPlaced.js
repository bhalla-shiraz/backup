module.exports = function(json) {
  if(json['orderId'] == null){
   return "Placed  -->" + json['purchaseContractLocation']['stateOrProvinceCode'];
  }
  else{
   return "Not Placed";
  }
}
