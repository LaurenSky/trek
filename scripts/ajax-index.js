var createHeaders = function(headerId, responseKeys) {
  var headers = headerId;
  headers.empty();

  var headerName = $('<th>' + responseKeys[1] + '</th>');
  var headerContinent = $('<th>' + responseKeys[2] + '</th>');
  var headerWeeks = $('<th>' + responseKeys[3] + '</th>');

  headers.append(headerName, headerContinent, headerWeeks);
};

var toggleTableView = function(onIndicator) {
  $('.trip-details').toggle(!onIndicator);
  $('#all-trips-button').toggle(!onIndicator);
  $('.continent-trips').toggle(!onIndicator);
  $('table.all-trips').toggle(onIndicator);
};


//FOR .BUTTON ON INITIAL VIEW OF INDEX PAGE
var failCallback = function(xhr) {
  console.log('failure');
  console.log(xhr);
};

// What do we want to happen when we get our response?
var successCallback = function (response) {
  console.log('success!');

  var body = $('.trips-body');
  var headerId = $('.trips-header');

  body.empty(); // Clear this out to start with to ensure we are populating fresh

  createHeaders(headerId, Object.keys(response[0]));

  $.each(response, function(index, trip){
    var row = $('<tr></tr>');
    var name = $('<td><a href="#" class="name-link" id=' + trip.id + '>' + trip.name + '</a></td>'); //data attribute
    // var name = $('<td>' + trip.name + '</td>');
    var continent = $('<td>' + trip.continent + '</td>');
    var weeks = $('<td>' + trip.weeks + '</td>');

    row.append(name, continent, weeks);
    body.append(row);
  });

  $('#trip-details').css('display','none');
  $('#add-reservation-form').css('display','none');
  toggleTableView(true);
};

//FOR TBODY ON INITIAL VIEW OF INDEX PAGE TO CREATE SHOW VIEW
var showSuccess = function(trip) {
  var section = $('#trip-details');
  // var title = $('<strong>Trip Details:</strong><div class="add-padding-bot"></div>');

  var id = $('<strong>Trip Id</strong><div class="add-padding-bot">' + trip.id + '</div>');
  var name = $('<strong>Name</strong><div class="add-padding-bot">' + trip.name + '</div>');
  var continent = $('<strong>Location</strong><div class="add-padding-bot" id="continent">' + trip.continent + '</div>');
  var about = $('<strong>Trip Description</strong><div class="add-padding-bot">' + trip.about + '</div>');
  var category = $('<strong>Trip Category</strong><div class="add-padding-bot">' + trip.category + '</div>');
  var weeks = $('<strong>Weeks Long</strong><div class="add-padding-bot">' + trip.weeks + '</div>');
  var cost = $('<strong>Cost</strong><div class="add-padding-bot">' + '$ ' + trip.cost + '</div>');

  section.empty(); // Reset the HTML in case there is data from before
  // section.append(title);
  section.append(name, continent, weeks, category, about, cost, id);
  section.css('display','inline-block');
  $('#add-reservation-form').css('display','inline-block');

  //assigns the hiddden field in the form to the trip id when the form populates
  $('.trip-id').val(trip.id);

  toggleTableView(false);
};

var showFailure = function(xhr) {
  var section = $('.trip-details');
  section.html('<strong>Error has occurred</strong>');

  toggleTableView(false);
};

var showContinent = function(response) {
  // console.log("in showContinent");
  var body = $('.continent-trips-body');
  var headerId = $('.continent-trips-body');

  body.empty(); // Clear this out to start with to ensure we are populating fresh

  createHeaders(headerId, Object.keys(response[0]));

  $.each(response, function(index, trip){
    var row = $('<tr></tr>');
    var name = $('<td><a href="#" class="name-link" id=' + trip.id + ' continent=' + trip.continent + '>' + trip.name + '</a></td>');
     // var name = $('<td>' + trip.name + '</td>');
    var continent = $('<td>' + trip.continent + '</td>');
    var weeks = $('<td>' + trip.weeks + '</td>');

    console.log(name);

    row.append(name, continent, weeks);
    body.append(row);
  });

  toggleTableView(false);
};


//DOCUMENT LOAD
$(document).ready(function() {
  // Which URL do we want to 'get'?
  var url = 'https://trektravel.herokuapp.com/trips';

  $('#all-trips-button').click(function() {
    $.get(url, successCallback)
      .fail(failCallback);
  });

  //>>>>>>>>>>>>>>>>>>>>>>>
  $('tbody').on('click', 'a', function(event) {
    event.preventDefault();

    var id = $(this).attr('id');
    var showUrl = url + '/' + id;
    $.get(showUrl, showSuccess)
      .fail(showFailure)
      .done(function(){
        console.log($('#continent').text());
        var continentName = $('#continent').text();
        var continentUrl = 'https://trektravel.herokuapp.com/trips/' + 'continent?query=' + continentName ;
        $.get(continentUrl, showContinent);
      });
  });

  $('#add-reservation-form').submit(addReservationCallback);

});

//POST:
var postCallback = function () {
  alert("Your Trip is Booked!");
};

var addReservationCallback = function(event) {
  event.preventDefault();
  var tripId = $('.trip-id').val();

  console.log("Booking Your trip!");
  var reservationUrl = 'https://trektravel.herokuapp.com/trips/' + tripId + '/reserve';
  var reservationData = $(this).serialize();
  console.log("Reservation data is " + reservationData);

  $.post(reservationUrl, reservationData, postCallback);

  toggleTableView(false);
};
