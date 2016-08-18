$(document).ready(function(){


 $("#all-graphs").addClass("active");
 $("#event-form").hide();
 $("#big-group").hide();

 $("#events").click(function(){
   $(".graph").hide();
   $("#big-group").hide();
   $("#all-graphs").removeClass("active");
   $("#big-group-link").removeClass("active");
   $("#events").addClass("active");
   $("#event-form").show();
  });

 $("#all-graphs").click(function(){
  $(".graph").show();
  $("#big-group").hide();
  $("#event-form").hide();
  $("#all-graphs").addClass("active");
  $("#events").removeClass("active");
  $("#big-group-link").removeClass("active");


 });

 $("#big-group-link").click(function(){
  $("#big-group").show();
  $(".graph").hide();
  $("#event-form").hide();
  $("#big-group-link").addClass("active");
  $("#events").removeClass("active");
  $("#all-graphs").removeClass("active");

 });

 $("#submitEvent").click(function(){

  window.location.reload(true);
  // var eventDataForm = JSON.stringify($("#eventForm").serializeArray());
  $(".graph").hide();
  $("#big-group").hide();
  $("#event-form").show();
  var name = $("#name").val();
  // $.get('http://127.0.0.1:3000/events', function(list) {
  //               $('#response').html(list); // show the list
  //           });
  // $.post('http://127.0.0.1:3000/');
  $.ajax({
    type: "GET",
    url: '/events',
    data: {
        name: $('#name').val(),
        time: $('#time').val()
    },
    success: function(r){
      $('#response').html("sent");
    },
    error: function(){
     $('#response').html("not sent");
    },
    // dataType: "json",
    contentType : "application/json"
  });

  // location.reload(true);
 });
 $('#datetimepicker1').datepicker();
});
