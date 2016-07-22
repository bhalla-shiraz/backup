queue()
    .defer(d3.json, "/checkout")
    .await(getGraphs);

function formatTime(date) {
  var hour = date.getHours();
  var min  = date.getMinutes();
  var year = date.getFullYear();
  var month= date.getMonth();
  var date = date.getDate();

  console.log("year is " + year);
  hour = hour % 24;
  hour = hour ? hour : 24;
  min = min < 10 ? '0'+min : min;
  var time = hour + ":" + min + ":" + year +":" + month +":" + date;
  return (time);
}

function getGraphs(error, data) {

 //Create a Crossfilter instance
 var ndx = crossfilter(data);

 var parseDate = d3.time.format("%H:%M:%Y:%m:%d").parse;

 data.forEach(function(d) {
     console.log("order " +d.orderId);
     // console.log(d.createdDate);
     d.createdDate = new Date(parseInt(d.createdDate));
     // console.log(d.createdDate);
     d.createdDate = formatTime(d.createdDate);
     // console.log(d.createdDate);
     d.createdDate = parseDate(d.createdDate);
     // console.log("parsed "+ d.createdDate);

     d.numberOfSession = 1;

 });





 var dateOfContract = ndx.dimension(function(d) {
  return d.createdDate;
 });

 var state = ndx.dimension(function(d) {
  return d.purchaseContractLocation.stateOrProvinceCode;
 });

 var countSessions = dateOfContract.group().reduceSum(function(d) {
  return d.numberOfSession;
 });

 var sessionsPerState = state.group().reduceSum(function(d) {
  return d.numberOfSession;
 });
 var sessionsPlacedGroup = state.group().reduceSum(function(d) {
  if(d.orderId != null ){
   return 1;
  }
  else{
   return 0;
  }
 });

 var sessionsConvertedGroup = state.group().reduceSum(function(d) {
  if(d.orderId != null ){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });

 var sessionsNotPlacedGroup = state.group().reduceSum(function(d) {
  if(d.orderId == null ){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });


 var contractDate = dateOfContract.group();
 var state        = dateOfContract.group();
 //check what groupall does
 //check if you create new group with orderid is it accessible at charts part
 var all          = ndx.groupAll();

 var minDate = dateOfContract.bottom(1)[0].createdDate;
 var maxDate = dateOfContract.top(1)[0].createdDate;


 console.log(minDate);
 console.log(maxDate);

 var dateChart              = dc.lineChart("#date-chart");
 var stateSessionsTotal     = dc.barChart("#state-sessions-total");
 var stateSessionsPlaced    = dc.barChart("#state-sessions-placed");
 var stateSessionsNotPlaced = dc.barChart("#state-sessions-not-placed");
 var totalSessions          = dc.numberDisplay("#total-sessions");
 var convertedSessions      = dc.numberDisplay("#converted-sessions");
 // var timeBarChart       = dc.barChart("#time-bar-chart");


 totalSessions
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

 convertedSessions
   .formatNumber(d3.format("d"))
   // .valueAccessor(function(d){
   //   return d;
   //  })
   .group(sessionsConvertedGroup);

 dateChart
        // .width(500)
        .height(250)
        .margins({top: 10, right: 10, bottom: 30, left: 30})
        .renderArea(true)
        .transitionDuration(1000)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .dimension(dateOfContract)
        .group(contractDate)
        .yAxisLabel("Number Of Sessions")
        .xAxisLabel("Time Of Day")
       	.x(d3.time.scale().domain([minDate, maxDate]));

 // timeBarChart
 //     //.width(800)
 //        .height(220)
 //        .transitionDuration(1000)
 //        .dimension(dateOfContract)
 //        .group(contractDate)
 //        .margins({top: 10, right: 50, bottom: 30, left: 50})
 //        .centerBar(false)
 //        .gap(5)
 //        .elasticY(true)
 //        .x(d3.time.scale().domain([minDate, maxDate]))
 //        .renderHorizontalGridLines(true)
 //        .renderVerticalGridLines(true)
 //        .yAxis().tickFormat(d3.format("s"));

 stateSessionsTotal
    	//.width(800)
        .height(250)
        .transitionDuration(1000)
        .dimension(state)
        .group(sessionsPerState)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(state))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("s"));

 stateSessionsPlaced
   	//.width(800)
       .height(250)
       .transitionDuration(1000)
       .dimension(state)
       .group(sessionsPlacedGroup)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .centerBar(false)
       .gap(5)
       .elasticY(true)
       .x(d3.scale.ordinal().domain(state))
       .xUnits(dc.units.ordinal)
       .renderHorizontalGridLines(true)
       .renderVerticalGridLines(true)
       .ordering(function(d){return d.value;})
       .yAxis().tickFormat(d3.format("s"));

 stateSessionsNotPlaced
   	//.width(800)
       .height(250)
       .transitionDuration(1000)
       .dimension(state)
       .group(sessionsNotPlacedGroup)
       .margins({top: 10, right: 50, bottom: 30, left: 50})
       .centerBar(false)
       .gap(5)
       .elasticY(true)
       .x(d3.scale.ordinal().domain(state))
       .xUnits(dc.units.ordinal)
       .renderHorizontalGridLines(true)
       .renderVerticalGridLines(true)
       .ordering(function(d){return d.value;})
         .yAxis().tickFormat(d3.format("s"));


   dc.renderAll();
}
