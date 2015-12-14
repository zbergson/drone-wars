$(document).ready(function(){

  var makeVisualizations = function() {
    var getDrones = function() {

      var urlDrone = 'http://api.dronestre.am/data';
        

      $.ajax({
        url: urlDrone,
        crossOrigin: true,
        type: "GET",
        dataType: 'jsonp'
      }).done(function(data){
        makeChart(data);
          $('#submit').click(function(){
            event.preventDefault();
            makeChart(data);
          });
      });

    }

    getDrones();




    var makeChart = function(data) {
      var time = moment(data.strike[0]['date']).format('YYYY');

      data = data.strike

      var data_array = [];

      data.forEach(function(data){
        var country = {"country" : data.country, "deaths" : parseInt(data.deaths_max), "year" : 
        parseInt(moment(data.date).format('YYYY')), "region" : data.location, "drone-strikes" : 1, "town" : data.town};
        data_array.push(country);
      });


      var country = $('#country').prop('checked');

      if (($('#country').prop('checked') === false && $('#year').prop('checked') === false && $('#region').prop('checked') === false && $('#number').prop('checked') === false && $('#town').prop('checked') === false )  || $('#year').prop('checked') === true) {

        var visualization = d3plus.viz()
        .container('#viz')
        .data(data_array)
        .type("stacked")
        .messages( "Loading..." )
        .id("country")
        .title('Drone Deaths Between 2002-present')
        .text("country")
        .y("deaths")
        .x("year")
        .ui([{ 
          "label": "Visualization Type",
          "method": "type", 
          "value": ["stacked", "scatter"]
        }])
        .time({"value": "year"})
        .timeline({"hover": "grab"})
        .timing({"transitions" : "1500"})
        .draw()

        $('#checkboxes').show();

      }

      else if (($('#country').prop('checked') === true) && ($('#region').prop('checked') === false && $('#year').prop('checked') === false && $('#number').prop('checked') === false && $('#town').prop('checked') === false)) {

        var visualization = d3plus.viz()
        .container('#viz')
        .data(data_array)
        .type("bar")
        .messages( "Loading..." )
        .id("country")
        .title('Drone Deaths Between 2002-present')
        .text("deaths")
        .y("deaths")
        .x("country")
        .timing({"transitions" : "1500"})
        .draw()

        $('#checkboxes').show();

      }

      else if (($('#region').prop('checked') === true) && ($('#country').prop('checked') === false && $('#year').prop('checked') === false && $('#number').prop('checked') === false && $('#town').prop('checked') === false) ) {

        var visualization = d3plus.viz()
        .container('#viz')
        .data(data_array)
        .type("bubbles")
        .messages( "Loading..." )
        .id(["country", "region"])
        .title('Drone Deaths by Region in Pakistan, Yemen and Somalia')
        // .text("region")
        .size("deaths")
        .color("country")
        .legend({"size" : 50})
        .timing({"transitions" : "1500"})
        .draw()

        $('#checkboxes').show();

      }

      else if (($('#town').prop('checked') === true) && ($('#country').prop('checked') === false && $('#year').prop('checked') === false && $('#number').prop('checked') === false && $('#region').prop('checked') === false) ) {

        var visualization = d3plus.viz()
        .container('#viz')
        .data(data_array)
        .type("tree_map")
        .messages( "Loading..." )
        .id(["country", "town"])
        .title('Drone Deaths by Region in Pakistan, Yemen and Somalia')
        // .text("region")
        .size("deaths")
        .color("country")
        .legend({"size" : 50})
        .timing({"transitions" : "1500"})
        .draw()

        $('#checkboxes').show();

      }

      else if (($('#number').prop('checked') === true) && ($('#country').prop('checked') === false && $('#year').prop('checked') === false && $('#region').prop('checked') === false && $('#town').prop('checked') === false) ) {

        var visualization = d3plus.viz()
        .container('#viz')
        .data(data_array)
        .type("line")
        .messages( "Loading..." )
        .id("country")
        .title('Number of Drone Strikes in Pakistan, Yemen and Somalia Between 2002-Present')
        .text("country")
        .y("drone-strikes")
        .x("year")
        .time({"value": "year"})
        .ui([{ 
          "label": "Visualization Type",
          "method": "type", 
          "value": ["line", "scatter"]
        }])
        .timeline({"hover": "grab"})
        .timing({"transitions" : "1500"})
        .draw()

        $('#checkboxes').show();

      }

      else {
        alert('please check one box!');
      }


    }
  }

  $('#charts').click(function(){

    $('#chartModal').show();
    makeVisualizations();
  })
    




});

