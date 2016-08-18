queue()
    .defer(d3.json, "/checkout")
    .await(getGraphs);

//data from events
var eventData;
$.getJSON('/getEvents', function (data) {
   eventData = data;
});


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

function getGraphs(error, data) {

 //Create a Crossfilter instance
 var ndx      = crossfilter(data);
 var ndxEvent = crossfilter(eventData);

 //Parse the dates - created and event dates
 var parseDate = d3.time.format("%H:%M:%Y:%m:%d").parse;

 data.forEach(function(d) {
     d.createdDate = new Date(parseInt(d.createdDate));
     d.createdDate = formatTime(d.createdDate);
     d.createdDate = parseDate(d.createdDate);
     d.numberOfSession = 1;

     //to get reduce sum to get the number of converted sessions
     //but can be later replaced with reduceCount by decreasing dimension values
     if(d.orderId != null){
      d.converted = 1;
     }
     else {
      d.converted = 0;
     }

 });

 //events that occured
 eventData.forEach(function(d){
  d.time = new Date(parseInt(d.time));
  d.time = formatTime(d.time);
  d.time = parseDate(d.time);
 });

 //Dimensions
 var convertedDimension = ndx.dimension(function(d) {
  return d.converted;
 });

 var dateOfContract = ndx.dimension(function(d) {
  return d.createdDate;
 });



 var dateOfConvertedContract = ndx.dimension(function(d) {
  if(d.orderId != null)
   return d.createdDate;
 });

 var itemDimension = ndx.dimension(function(d){
   return d.itemCount;
 });

 var state = ndx.dimension(function(d) {
  return d.purchaseContractLocation.stateOrProvinceCode;
 });




//groups
 var countSessions = dateOfContract.group().reduceSum(function(d) {
  return d.numberOfSession;
 });



 var sessionsPerState = state.group().reduceSum(function(d) {
  return d.numberOfSession;
 });

 var sessionsPlacedGroup = state.group().reduceSum(function(d) {
  if(d.orderId != null ){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });


 var sessionsConvertedGroup = convertedDimension.group().reduceSum(function(d) {
  if(d.orderId != null ){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });

 var itemsNotPlacedGroup = itemDimension.group().reduceSum(function(d){
  if(d.orderId == null){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });

 var itemsPlacedGroup = itemDimension.group().reduceSum(function(d){
  if(d.orderId != null){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });

 var itemsTotalGroup = itemDimension.group().reduceSum(function(d){
   return d.numberOfSession;
 });

 var sessionsNotPlacedGroup = state.group().reduceSum(function(d) {
  if(d.orderId == null ){
   return d.numberOfSession;
  }
  else{
   return 0;
  }
 });

 //try: get max and min range of number of sessions on a particular date
 //why? - in order to get estimation of graph range
 console.log(countSessions.all());
 maxSessionsPerdate = countSessions.top(1)[0].value;
 console.log(maxSessionsPerdate);

 var eventDimension = ndxEvent.dimension(function(d) {
  return [+d.time, +maxSessionsPerdate];;
 });

 var countEvent = eventDimension.group().reduceSum(function(d) {
  return 5;
 });

 var contractDate = dateOfContract.group();
 var eventDate    = eventDimension.group();
 var state        = dateOfContract.group();
 //check what groupall does
 //check if you create new group with orderid is it accessible at charts part
 var all          = ndx.groupAll();
 var minDate = dateOfContract.bottom(1)[0].createdDate;
 var maxDate = dateOfContract.top(1)[0].createdDate;

 var dateChart              = dc.lineChart("#date-chart");
 var stateSessionsTotal     = dc.barChart("#state-sessions-total");
 var stateSessionsPlaced    = dc.barChart("#state-sessions-placed");
 var stateSessionsNotPlaced = dc.barChart("#state-sessions-not-placed");
 var totalSessions          = dc.numberDisplay("#total-sessions");
 var convertedSessions      = dc.numberDisplay("#converted-sessions");
 var itemsSessionsNotPlaced = dc.barChart("#items-not-placed");
 var itemsSessionsPlaced    = dc.barChart("#items-placed");
 var itemsTotalSessions     = dc.barChart("#items-total");
 var conversionChart        = dc.compositeChart("#conversion-chart");



 var compostion1            =dc.lineChart(conversionChart)
                                .dimension(dateOfContract)
                                .colors('red')
                                .group(contractDate)
                                .dashStyle([2,2]);

 var compostion2            =dc.scatterPlot(conversionChart)
                                .dimension(eventDimension)
                                .colors('blue')
                                .group(eventDate)
                                .symbolSize(8);
//all the graphs
 totalSessions
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(all);

 convertedSessions
   .formatNumber(d3.format("d"))
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
         	.x(d3.time.scale().domain([minDate, maxDate]))
          .yAxis().tickFormat(d3.format("d"));

  conversionChart
          .height(450)
          .margins({top: 10, right: 10, bottom: 30, left: 30})
          .transitionDuration(1000)
          .elasticY(true)
          .renderHorizontalGridLines(true)
          .renderVerticalGridLines(true)
          .yAxisLabel("Number Of Sessions")
          .xAxisLabel("Time Of Day")
          .x(d3.time.scale().domain([minDate, maxDate]))
          .compose([
            compostion1,
            compostion2
            ])
            .brushOn(false);

  stateSessionsTotal
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
         .yAxis().tickFormat(d3.format("d"));

  stateSessionsPlaced
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
        .yAxis().tickFormat(d3.format("d"));

 stateSessionsNotPlaced
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
        .yAxis().tickFormat(d3.format("d"));

 itemsSessionsNotPlaced
      //.width(800)
         .height(250)
         .transitionDuration(1000)
         .dimension(itemDimension)
         .group(itemsNotPlacedGroup)
         .margins({top: 10, right: 50, bottom: 30, left: 50})
         .centerBar(false)
         .gap(5)
         .elasticY(true)
         .x(d3.scale.ordinal().domain(itemDimension))
         .xUnits(dc.units.ordinal)
         .renderHorizontalGridLines(true)
         .renderVerticalGridLines(true)
         .ordering(function(d){return d.value;})
           .yAxis().tickFormat(d3.format("d"));

  itemsSessionsPlaced
     //.width(800)
        .height(250)
        .transitionDuration(1000)
        .dimension(itemDimension)
        .group(itemsPlacedGroup)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .centerBar(false)
        .gap(5)
        .elasticY(true)
        .x(d3.scale.ordinal().domain(itemDimension))
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .ordering(function(d){return d.value;})
          .yAxis().tickFormat(d3.format("d"));


itemsTotalSessions
   //.width(800)
      .height(250)
      .transitionDuration(1000)
      .dimension(itemDimension)
      .group(itemsTotalGroup)
      .margins({top: 10, right: 50, bottom: 30, left: 50})
      .centerBar(false)
      .gap(5)
      .elasticY(true)
      .x(d3.scale.ordinal().domain(state))
      .xUnits(dc.units.ordinal)
      .renderHorizontalGridLines(true)
      .renderVerticalGridLines(true)
      .ordering(function(d){return d.value;})
        .yAxis().tickFormat(d3.format("d"));





   dc.renderAll();
}
