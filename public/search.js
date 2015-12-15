$(document).ready(function(){


	$('#search').click(function(){
		$('#searchModal').show();
		
	});

	$('#nytimes-click-panel').click(function(){
		$('#searchModal').show();
	});

	$('.close-search').click(function(){
		$('#searchModal').hide();
		console.log('close search works!');
	});

	$('#search-submit').click(function(){
		event.preventDefault();
		nytSearchSubmit();
	});


	var nytSearchSubmit = function() {

		var searchInput = $('#search-bar').val();
		console.log(searchInput);
		var time = moment().format('YYYYMMDD');
		var urlNYT = "http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=drone+strike+" + searchInput + "&begin_date=20020103&end_date=" + time + "&hl=true&api-key=0ccac0966ace059aa2c0bfcc40fb7486%3A12%3A47757838";
		$.ajax({
  		url: urlNYT,
  		type: "GET",
  		dataType: 'json'
  	}).done(function(data){
  		showNYTData(data);
  	});
	}

	var showNYTData = function(data) {
		console.log(data);
		$('#search-bar').val('');
		$('.nyt-article').remove();
		var nytSearchTemplate = Handlebars.compile($("#nyt-search-results").html());
		// $('#search-container').empty();
		for (i = 0; i < data.response.docs.length; i++) {
			var pub_date = moment(data.response.docs[i]['pub_date']).format('l');
			var context = {_id: data.response.docs[i]['_id'], web_url: data.response.docs[i]['web_url'], headline: data.response.docs[i]['headline']['main'], summary: data.response.docs[i]['abstract'], date: pub_date}
			var html = nytSearchTemplate(context);
			$('#search-container').append(html)
		}

		var saveNYT = $('.save-nyt');
		for (i = 0; i < saveNYT.length; i++) {
			$(saveNYT[i]).click(saveNYTArticle);
		}

	}

	// $(document).on("click", ".save-nyt", function() {
	// 	saveNYTArticle();
	// });

	var saveNYTArticle = function() {
		console.log('click worked');
		var nyt_id_input = $(this).parent().attr('data-id');
		var web_url_input = $(this).parent().attr('url');
		var summary_input = $(this).parent().attr('summary');
		var date_input = $(this).parent().attr('date');
		var headline_input = $(this).parent().attr('headline');

		var nytArticleData = {
			id: nyt_id_input,
			headline: headline_input,
			summary: summary_input,
			date: date_input,
			web_url: web_url_input
		}

		$.ajax({
			url: "/users/" + Cookies.get("loggedinId") + "/nyt",
			type: "POST",
			dataType: 'json',
			data: nytArticleData
		}).done(console.log('post complete'));
		

	}





































});