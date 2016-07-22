queue()
    .defer(d3.json, "/checkout")
    .await(getGraphs);

function formatTime(date) {
  var hour = date.getHours();
  var min  = date.getMinutes();
  hour = hour % 24;
  hour = hour ? hour : 24;
  min = min < 10 ? '0'+min : min;
  var timeInFloat = hour + ":" + min;
  return (timeInFloat);
}

function getGraphs(error, data) {
 var date;


 //Below commented code is for extracting date======
 //  data.forEach(function(d) {
 //    var dateFormat = d3.time.format("%m/%d/%Y");
 //    d.createdDate = new Date(parseInt(d.createdDate));
 //    d.createdDate = d.createdDate.toLocaleDateString();
 //    d.createdDate = dateFormat.parse(d.createdDate);
 //    //d.createdDate.setDate(1);
 //    console.log(d.createdDate);
 // });


 //Below code is for extracting time of day - as we are concentrating on single day======
  data.forEach(function(d) {
   console.log(d.orderId);
    // var day = d.createdDate;
     // var dateFullFormat = new Date(parseInt(d.createdDate));
     // var dateFullFormat = dateFullFormat.toString();
     // var arr = dateFullFormat.split(" ");
     //
     // var dateFormat = d3.time.format("%H:%M:%S");
     // d.createdDate = dateFormat.parse(arr[4]);

     // console.log("arr " + arr[4]);

     console.log(d.createdDate);
     d.createdDate = formatTime(new Date(parseInt(d.createdDate)));
     var parseDate = d3.time.format("%H:%M").parse;

     d.createdDate = parseDate;
     console.log(d.createdDate);

     // console.log(typeof(time) + "   " + time);
     // console.log("h is " + parseInt(h));


 });




//Create a Crossfilter instance
	var ndx = crossfilter(data);

 var dateOfContract = ndx.dimension(function(d) {
  // console.log(parseInt(d.createdDate));
  return parseInt(d.createdDate);
 });

 var ContractsByDate = dateOfContract.group();

 var all = ndx.groupAll();

 var minDate = 0;
 var maxDate = 24;

 console.log(minDate);
 console.log(maxDate);

 var dateChart = dc.lineChart("#date-chart");


 dateChart
		.width(1000)
		.height(420)
		.margins({top: 10, right: 100, bottom: 40, left: 80})
		.dimension(dateOfContract)
		.group(ContractsByDate)
		.renderArea(true)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([minDate, maxDate]))
  .elasticY(true)
		.renderHorizontalGridLines(true)
    	.renderVerticalGridLines(true)
		.xAxisLabel("Time Of Day")
		.xAxis().ticks(24)
  // .yAxis().ticks(5);

   dc.renderAll();
}
