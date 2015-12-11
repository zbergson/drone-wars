$(document).ready(function(){

	var socket = io();

	$('#tweet-button').click(function(){
		$('#tweetModal').show();
		$('.close-tweets').click(function(){
			$('#tweetModal').hide();
		});

		var tweet_array = [];
		
		socket.on('drone-tweets', function(tweet){

			var twitterListTemplate = Handlebars.compile($("#tweet-results").html());



				var context = {username: tweet['user']['screen_name'], img_url: tweet['user']['profile_image_url'], content: tweet['text']}
				var html = twitterListTemplate(context);
				$('#tweets-container').prepend(html);

			
		});
	});

	

	




	var loadTwitterList = function(tweet) {
		console.log(tweet);


		var twitterListTemplate = Handlebars.compile($("#tweet-results").html());
		
	}










});