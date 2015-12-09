$(document).ready(function(){


	$('#search').click(function(){
		$('#searchModal').show();
		
	});

	$('#search-submit').click(function(){
		event.preventDefault();
		searchSubmit();
	});

	var searchSubmit = function() {
		var searchInput = $('#search-bar').val();
		console.log(searchInput);
		var time = moment().format('YYYYMMDD');
		var urlNYT = "http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=drone+strike+" + searchInput + "&begin_date=20020103&end_date=" + time + "&hl=true&api-key=0ccac0966ace059aa2c0bfcc40fb7486%3A12%3A47757838";
		$.ajax({
  		url: urlNYT,
  		type: "GET",
  		dataType: 'json'
  	}).done(function(data){
  		console.log(data);
  	});
	}

































});