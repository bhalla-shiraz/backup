
//Give dimensions and areas to graphs
var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    height2 = 500 - margin2.top - margin2.bottom;

var bisectDatePercentGraph = d3.bisector(function(d) { return d.date; }).left;
var formatPercent = d3.format(".0%");

//ranges
var xPercentGraph = d3.time.scale()
           .range([0, width]);

var xPercentGraph2 = d3.time.scale()
           .range([0, width]);

var yPercentGraph = d3.scale.linear()
           .range([height, 0]);


var yPercentGraph2 = d3.scale.linear()
            .range([height2, 0]);

//Axis orientation
var xAxisPercentGraph = d3.svg.axis()
            .scale(xPercentGraph)
            .orient("bottom");

var xAxisPercentGraph2 = d3.svg.axis()
             .scale(xPercentGraph2)
             .orient("bottom");

var yAxisPercentGraph = d3.svg.axis()
             .scale(yPercentGraph)
             .orient("left")
             .tickFormat(formatPercent);

var brushPercentGraph = d3.svg.brush()
    .x(xPercentGraph2)
    .on("brush", brushedPercentGraph);

var linePercentGraph = d3.svg.line()
    .x(function(d) { return xPercentGraph(d.date); })
    .y(function(d) { return yPercentGraph((d.close/d.total)); });

var linePercentGraph2 = d3.svg.line()
    .x(function(d) { return xPercentGraph2(d.date); })
    .y(function(d) { return yPercentGraph2((d.close/d.total)); });

var svgPercentGraph = d3.select("#percent-conv-graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var divPercentGraph = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    svgPercentGraph.append("defs").append("clipPath")
     .attr("id", "clip")
     .append("rect")
     .attr("width", width)
     .attr("height", height);

var focusPercentGraph = svgPercentGraph.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var contextPercentGraph = svgPercentGraph.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//trying better circle point map
var eventCircleGroupPercentGraph = focusPercentGraph.append("g");
eventCircleGroupPercentGraph.attr("clip-path", "url(#clip)");

d3.csv("/big", type, function(error, data) {
  if (error) throw error;
  data.sort(function(a,b) {return a.date-b.date;});
  xPercentGraph.domain(d3.extent(data, function(d) { return d.date; }));
  yPercentGraph.domain([0, 1]);
  xPercentGraph2.domain(xPercentGraph.domain());
  yPercentGraph2.domain(yPercentGraph.domain());

  focusPercentGraph.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", linePercentGraph);

  focusPercentGraph.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisPercentGraph);

  focusPercentGraph.append("g")
      .attr("class", "y axis")
      .call(yAxisPercentGraph);

  focusPercentGraph.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      // .on("mousemove", mousemove)
      .style("pointer-events", "none");;

 focusPercentGraph.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(" + 5 + (height/2) + ")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .text("Value");
 contextPercentGraph.append("path")
     .datum(data)
     .attr("class", "line")
     .attr("d", linePercentGraph2);

 contextPercentGraph.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height2 + ")")
     .call(xAxisPercentGraph2);

 contextPercentGraph.append("g")
     .attr("class", "x brush")
     .call(brushPercentGraph)
   .selectAll("rect")
     .attr("y", -6)
     .attr("height", height2 + 7);



     //find nearest point
     // var pathEl = focus.node();
     // var pathLength = pathEl.getTotalLength();
     // console.log("Length of path is " + pathLength);
     // var BBox = pathEl.getBBox();
     // console.log("box of path is ");
     // console.log(BBox);
     // var scale = pathLength/BBox.width;
     // var offsetLeft = document.getElementById("line").offsetLeft;
     // function mousemove() {
     //  var x0 = x.invert(d3.mouse(this)[0]);
     //  // console.log(x0);
     //
     //  var i = bisectDate(data, x0, 1);
     //  var d0 = data[i-1];
     //  var d1 = data[i];
     //  var d = x0 - d0.date > d1.date - x0 ? d1 : d0;
     //  // console.log(d);
     // }
     // d3.json("/getEvents", function(error, dataEvent) {
     //  // console.log(dataEvent);
     //  dataEvent.forEach(function(d){
     //   console.log(d.time);
     //   var x0 = new Date(parseInt(d.time));
     //   x0 = formatTime(x0);
     //   console.log(x0);
     //   x0 = parseDate(x0);
     //   console.log(x0);
     //   var i = bisectDate(data, x0, 1);
     //   console.log(x0);
     //   console.log(i);
     //   var d0 = data[i-1];
     //   var d1 = data[i];
     //   if(d1 != null && d0 != null){
     //    var d_result = x0 - d0.date > d1.date - x0 ? d1 : d0;
     //    console.log(d_result);
     //
     //    focus.append("circle")
     //    .attr("cx", function(d) { return x(d_result.date); })
     //    .attr("cy", function(d) { return y(d_result.close); })
     //    .attr("r", 5)
     //   .style("fill", "purple");
     //   }
     //  });
     // });


     //trying something new
     // d3.json("/getEvents", function(error, dataEvent) {
     //  // console.log(dataEvent);
     //  dataEvent.forEach(function(d){
     //   console.log(d.time);
     //   var x0 = new Date(parseInt(d.time));
     //   x0 = formatTime(x0);
     //   console.log(x0);
     //   x0 = parseDate(x0);
     //   console.log(x0);
     //   var i = bisectDate(data, x0, 1);
     //   console.log(x0);
     //   console.log(i);
     //   var d0 = data[i-1];
     //   var d1 = data[i];
     //   if(d1 != null && d0 != null){
     //    var interpolate = d3.interpolateNumber(d0.close, d1.close);
     //   var range = d1.date - d0.date;
     //   var valueY = interpolate((x0 % range) / range);
     //   console.log(range);
     //
     //    focus.append("circle")
     //    .attr("cx", x(x0))
     //    .attr("cy", y(valueY))
     //    .attr("r", 5)
     //    // .style("fill", "purple");
     //   }
     //   });
     //  });


     // d3.json("/getEvents", function(error, dataEvent) {
     //  // console.log(dataEvent);
     //  dataEvent.forEach(function(d){
     //   var x0 = new Date(parseInt(d.time));
     //   x0 = formatTime(x0);
     //   x0 = parseDate(x0);
     //   var i = bisectDate(data, x0, 1);
     //   var d0 = data[i-1];
     //   var d1 = data[i];
     //   if(d1 != null && d0 != null){
     //    var interpolate = d3.interpolateNumber(d0.close, d1.close);
     //    var range = d1.date - d0.date;
     //    var valueY = interpolate((x0 % range) / range);
     //
     //    eventCircleGroup.append("circle")
     //    .attr('class', 'events')
     //    .attr("cx", x(x0))
     //    .attr("cy", y(valueY))
     //    .attr("r", 5)
     //    .style("fill", "purple");
     //   }
     //   });
     //  });

d3.json("/getEvents", function(error, dataEvent) {
 var y_value = -1;

 eventCircleGroupPercentGraph.selectAll('.events')
 .data(dataEvent)
 .enter().append("circle")
 .attr('class', 'events')
 .attr("cx",function(d){
  // var x0 = getDate(d.time);
  var x0 = getDate(d.time);
  var y0 = getYPercentGraph(data, x0);
  var x0 = getDate(d.time);
  // console.log("look at this");
  // console.log(x0.getTime());
  if(y0 != -1){
   return xPercentGraph(x0);
  }
 })
 .attr("cy",function(d){
  var x0 = getDate(d.time);
  var y0 = getYPercentGraph(data, x0);
  // console.log(data);
  // console.log(data[0].date.getTime());
  // console.log(x0);
  // console.log(y0);

  if(y0 != -1){
   return yPercentGraph(y0);
  }
 })
 .attr("r", function(d){ return 4;})
 .style("fill", "purple")
 .attr('pointer-events', 'all')
 .on("mouseover", function(d) {
   // console.log(d);
   // console.log(data);
      divPercentGraph.transition()
          .duration(200)
          .style("opacity", .9);
      divPercentGraph .html( d.name )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
  .on("mouseout", function(d) {
      divPercentGraph.transition()
          .duration(1000)
          .style("opacity", 0);
  });
});


});

//read the time of event and map on to the graph

//milisec to date - event data
function getDate(timeInMilisec){
 var date = new Date(parseInt(timeInMilisec));
 date = formatTime(date);
 date = parseDate(date);
 // console.log(date);
 return date;
}

function getYPercentGraph(data, date){
 // console.log("date under test");
 // console.log(date);

 var indexOfBisectPercentGraph = bisectDatePercentGraph(data, date);
 var d0 = data[indexOfBisectPercentGraph-1];
 var d1 = data[indexOfBisectPercentGraph];
 // console.log("point ");


 if(d1 != null && d0 != null){
  var leftTime = d0.date.getTime();
  var rightTime= d1.date.getTime();

  var yDiff = d0.close/d0.total - d1.close/d1.total;
  var xDiff = leftTime - rightTime;
  var pointXdiff = date.getTime() - rightTime;
  var yAdder = d1.close/d1.total;
  var y1 = (yDiff/xDiff) * pointXdiff + yAdder;
  // console.log(y1);


  // var interpolate = d3.interpolateNumber(d0.close, d1.close);
  // var range = d1.date - d0.date;
  // console.log("ranger");
  // console.log(date - d0.date);
  //
  // console.log(range);

  // var y1 = interpolate((date % range) / range);
 }
 else {
  var y1 = -1;
 }
 // console.log("y");
 // console.log(y1);
 return (y1);

}

function type(d) {
 // console.log(d);
 d.date = new Date(parseInt(d.date));
 d.date = formatTime(d.date);
 d.date = parseDate(d.date);
 d.close = +d.close;
 return d;
}

function brushedPercentGraph() {
 xPercentGraph.domain(brushPercentGraph.empty() ? xPercentGraph2.domain() : brushPercentGraph.extent());
 focusPercentGraph.select(".line").attr("d", linePercentGraph);
 focusPercentGraph.select(".x.axis").call(xAxisPercentGraph);

 d3.csv("/big", type, function(error, data) {
   data.sort(function(a,b) {return a.date-b.date;});
   eventCircleGroupPercentGraph.selectAll(".events")
   .attr("cx",function(d){
    var x0 = getDate(d.time);
    var y0 = getYPercentGraph(data, x0);
    if(y0 != -1){
     return xPercentGraph(x0);
    }
   })
   .attr("cy",function(d){
    var x0 = getDate(d.time);
    var y0 = getYPercentGraph(data, x0);
    // console.log(y0);
    if(y0 != -1){
     return yPercentGraph(y0);
    }
   })
   .attr("r", function(d){ return 4;})
   .style("fill", "purple");



 });

}
