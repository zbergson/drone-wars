$(document).ready(function(){


  var makeMyMap = function() {
    console.log('in make my map')
  //=======================================================================================
  //===========================get drone data from api=====================================
  //=======================================================================================
    var getDrones = function() {

    	var urlDrone = 'http://api.dronestre.am/data';
    		

    	$.ajax({
    		url: urlDrone,
    		crossOrigin: true,
    		type: "GET",
    		dataType: 'jsonp'
    	}).done(function(data){
    		addMap(data);
    	});

    }

    getDrones();

  //=======================================================================================
  //===========================set empty array for gmaps markers===========================
  //=======================================================================================

    var gmarkers = [];

  //=======================================================================================
  //===========================start add map function======================================
  //=======================================================================================

  	var addMap = function(data) {
  		console.log('in add map')
  		var map;

       function initialize() {
          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: new google.maps.LatLng(21.424534, 38.599836),
            mapTypeId: google.maps.MapTypeId.TERRAIN
          });
          window.setTimeout(function(){
            addMarker(data);
          }, 600);
        }

        
  		  var addMarker = function(data) {
  		  	console.log(data.strike.length)
          for (var i = 0; i < data.strike.length; i++) {
            var lat = parseFloat(data.strike[i]['lat']);
            var lon = parseFloat(data.strike[i]['lon']);
            var latLng = new google.maps.LatLng(lat,lon);
            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              town: data.strike[i]['town'],
              country: data.strike[i]['country'],
              date: data.strike[i]['date'],
              narrative: data.strike[i]['narrative'],
              deaths: data.strike[i]['deaths'],
              article_link: data.strike[i]['bij_link']
             });
            gmarkers.push(marker);

            var infowindow = new google.maps.InfoWindow()

  //=======================================================================================
  //===========================set content for gmaps info window===========================
  //=======================================================================================

            var content = 
            	"<span class='strikeTitle'>" + "<span class='strikeTown'>" + marker.town + "</span>" + ", " + "<span class='strikeCountry'>" + marker.country + "</span>" + "</span>" 
            	+ "<br>" + "<span class='strikeDate'>" + marker.date +"</span>" +"<br>"+ 
            	"<span class='strikeNarrative'>" + marker.narrative + "</span>"+"<br>"+ 
            	"<span class='strikeDeaths'>" + marker.deaths + "</span>" + "<br>" + 
            	"<span class='strikeArticle'>" + "<a href=" + marker.article_link + ">Article</a>" + "</span>" + "<br>" +
            	"<button id='saveArticle'> Save </button>";
            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
  				    return function() {
  				        infowindow.setContent(content);
  				        infowindow.open(map,marker);
  				    };
  					})(marker,content,infowindow));  

          }
        }

  //=======================================================================================
  //===========================call map on window load=====================================
  //=======================================================================================
        
  			
  	// google.maps.event.addDomListener(window, 'load', initialize);
    initialize();
    // google.maps.event.addDomListener(window, "resize", resizingMap());



  	}

  //   $('#mapModal').on('show.bs.modal', function() {
  //    //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
  //    resizingMap();
  //   })

  // function resizeMap() {
  //   console.log('inside resize map')
  //    if (typeof map =="undefined") {
  //     return;
  //    } 
  //    setTimeout( function(){resizingMap();} , 200);
  // }

  // function resizingMap() {
  //    if(typeof map =="undefined") {
  //     return;
  //    }
     
  //    google.maps.event.trigger(map, "resize");
     
  

  //=======================================================================================
  //===========================sort markers by country=====================================
  //=======================================================================================


    filterMarkers = function(category) {
      console.log('filter is working');         

        for (i = 0; i < gmarkers.length; i++) {
          marker = gmarkers[i];
          // If is same category or category not picked
          if (gmarkers[i]['country'] == category || category.length === 0) {
            marker.setVisible(true);
          }
          // Categories don't match 
          else {
            marker.setVisible(false);
          }
        }
    }

  }

  $('#map-click').click(function(){
    makeMyMap();
    $("#mapModal").show();
    

  });

  $('.close-map').click(function(){
    $("#mapModal").hide();
  })

});











