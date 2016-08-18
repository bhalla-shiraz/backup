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











////////////////





var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    height2 = 500 - margin2.top - margin2.bottom;

//x, y is for the bif graph range
var x = d3.time.scale().range([0, width]),
    x2 = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");
    // y2Axis = d3.svg.axis().scale(y2).orient("left");

var brush = d3.svg.brush()
    .x(x2)
    .on("brush", brushed);

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) {
     return x(d.createdDate); })
    .y0(height)
    .y1(function(d) {
     // console.log("d is " + d.count);
     return y(d.count); });

var area2 = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x2(d.createdDate); })
    .y0(height2)
    .y1(function(d) { return y2(d.count); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


function formatTime(date) {
  var hour = date.getHours();
  var min  = date.getMinutes();
  var year = date.getFullYear();
  var month= date.getMonth();
  var date = date.getDate();

  // console.log("year is " + year);
  hour = hour % 24;
  hour = hour ? hour : 24;
  min = min < 10 ? '0'+min : min;
  var time = hour + ":" + min + ":" + year +":" + month +":" + date;
  return (time);
}


d3.json("/big", function(error, data) {
 var parseDate = d3.time.format("%H:%M:%Y:%m:%d").parse;

 data.forEach(function(d) {
     // d.createdDate = new Date(parseInt(d.createdDate));
     // d.createdDate = formatTime(d.createdDate);
     // d.createdDate = parseDate(d.createdDate);
     d.numberOfSession = 1;

 });

//To prove that new key is added
 data.forEach(function(d) {
    console.log("NUMBER IS " + d.numberOfSession);

 });

//let's try summing those keys
var newData = d3.nest()
  .key(function(d) { return d.createdDate;})
  .rollup(function(d) {
   return d3.sum(d, function(g) {return g.numberOfSession; });
  }).entries(data);

//To prove we got the grouped data
console.log(data);
console.log(newData);

//rename columns back

newData.forEach(function(d){

 d.createdDate = d.key;
 d.count       = d.values;
 d.count       = +d.count;

 d.createdDate = new Date(parseInt(d.createdDate));
 d.createdDate = formatTime(d.createdDate);
 d.createdDate = parseDate(d.createdDate);

 console.log("createdDate " + d.createdDate);
});
//To prove we got the grouped data
console.log(newData);

 // console.log(data);
  x.domain(d3.extent(newData.map(function(d) { return d.createdDate; })));
  y.domain([0, d3.max(newData.map(function(d) { return d.count; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("body")
      .datum(newData)
      .attr("class", "area")
      .attr("d", area);

  //create x Axis - main
  focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

 //create y Axis - main
  focus.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  context.append("body")
      .datum(newData)
      .attr("class", "area")
      .attr("d", area2);


  //smaller x
  context.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

 //
  context.append("g")
      .attr("class", "x brush")
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", height2 + 7);



      });

function brushed() {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  focus.select(".area").attr("d", area);
  focus.select(".x.axis").call(xAxis);
}

function type(d) {

  return d;
}
