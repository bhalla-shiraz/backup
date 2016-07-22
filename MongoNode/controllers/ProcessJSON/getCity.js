module.exports = function(json) {
// return json['buyerInfo'][];
 return (json['purchaseContractLocation']['city'] + ",  " + json['purchaseContractLocation']['stateOrProvinceCode']);
}
