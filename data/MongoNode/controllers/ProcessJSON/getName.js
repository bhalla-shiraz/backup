module.exports = function(json) {
// return json['buyerInfo'][];
 return (json['buyerInfo']['primaryContact']['name']['firstName'] + "  " + json['buyerInfo']['primaryContact']['name']['lastName']);
}
