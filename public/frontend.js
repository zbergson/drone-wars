$(document).ready(function(){ 
	
	$("#signup-button").click(function(){
		event.preventDefault();
		signupForm();
	});


//=======================================================================================
//==============================User sign up=============================================
//=======================================================================================

	var signupForm = function(){
		var usernameInput = $("#inputUserName").val();
		var firstNameInput = $("#inputFirstName").val();
		var lastNameInput = $("#inputLastName").val();
		var emailInput = $("#inputEmail").val();
		var passwordInput =$("#inputPassword").val();

		var user = {
			username: usernameInput,
			first_name: firstNameInput,
			last_name: lastNameInput,
			email: emailInput,
			password: passwordInput
		};

		$.ajax({
			url: '/users',
			method: 'POST',
			dataType: 'json',
			data: user
		}).done( loggedIn);

	};

//=======================================================================================
//===========================User login functionality====================================
//=======================================================================================

	$("#signin-button").click(function(){
		showSignInForm();
	});

	var showSignInForm = function() {
		$("#signinModal").show();
		$('#form-container').empty();
		$('#signin-button').hide();
		$('#signup-button').hide();
		$('#signup-form').remove();

		var template = Handlebars.compile($('#signin-form-template').html());

		$('#signin-container').append( template );

		$(".close-signin").click(function() {
			$("#signin-form").remove();
			$("#signinModal").hide();
			$('#signin-button').show();
		});

		$('#signin-submit').click(function() {
			console.log("testing submit");
			$("#signinModal").hide();

			$('#signin-form-template').hide();

			signinSubmit();
		});

	}

	//=======================================================================================
	//===========================Post request for Login======================================
	//=======================================================================================

	var signinSubmit = function() {
		var emailInput = $('#email').val();
		var passwordInput = $('#password').val();
		console.log('here at signinsubmit');
		event.preventDefault();

		var userLogin = {
			email: emailInput,
			password: passwordInput
		};

    $.ajax({
			url: '/login',
			type: 'POST',
			dataType: 'json',
			data: userLogin
		}).done(loggedIn).fail(function(){
			alert('wrong password or email!');
		});
	}

	//=======================================================================================
	//=====================================Sign out==========================================
	//=======================================================================================

	$('#signout').click(function(){
		Cookies.remove('loggedinId');
		location.reload();
	});

	var loggedIn = function(data){
		$('#signinModal').hide();
		$("#signup-container").hide();
		$('#username-container').append('<h1 id="welcome-username">Welcome, ' + data.username + "!</h1>");
		$('#signin-button').hide();
		$("#get-articles").show();
		$('#signout').show()
	}

	var checkCookies = function() {

		if (Cookies.get("loggedinId") != null) {
			$.ajax({
				url: "/users/" + Cookies.get("loggedinId"),
				method: "GET",
				dataType: "json"
			}).done(loggedIn);
			
		} else {
			$("#get-articles").hide();
			$("#signup-container").show();
			$('#signout').hide()
		};

	}

	checkCookies();


//=======================================================================================
//===============get info about saved drone strike to load on profile page===============
//=======================================================================================

	$("#get-articles").click(function(){
		getArticles();
		
	});

	var getArticles = function(){
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId"),
			method: 'GET',
			dataType: 'json',
		}).done(function(data){
			var source = $("#view-article-template").html();
			var template = Handlebars.compile(source);
			var context = { username: data.username, articles: data.articles, nyt_articles: data.nyt  };
			var html = template(context);
			var checkClass = $('#view-profile').hasClass('clicked');
			if(checkClass) {
				$('.saved-nyt-articles').empty();
				$('.saved-articles').empty();
			}
			$("#view-profile").append(html);
			
			$("#view-profile").addClass('clicked');

			var removeDroneArticle = $('.remove-article');

			for (i = 0; i < removeDroneArticle.length; i++) {
				$(removeDroneArticle[i]).click(deleteDroneArticle);
			}

		});
	};


	$('#nyt-data').click(function(){
		$('.saved-nyt-articles').show();
		$('.saved-articles').hide();
		deleteClickNYTArticle();
	});

	$('#dronemap-data').click(function(){
		$('.saved-nyt-articles').hide();
		$('.saved-articles').show();
		
	});

//=======================================================================================
//===============saved selected drone strike to profile page=============================
//=======================================================================================

	$(document).on("click", "#saveArticle", function() {
		saveArticleUser();
	});

	var saveArticleUser = function() {

		var attackTown = $('.strikeTown').text();
		var attackCountry = $('.strikeCountry').text();
		var attackDate = $('.strikeDate').text();
		var attackNarrative = $('.strikeNarrative').text();
		var attackDeaths = parseInt($('.strikeDeaths').text());
		var attackArticle = $('.strikeArticle').children().attr('href');
		console.log(attackArticle);
		
		var attackData = {
			town: attackTown,
			country: attackCountry,
			date: attackDate,
			narrative: attackNarrative,
			deaths: attackDeaths,
			article: attackArticle
		}

		$.ajax({
			url: "/users/" + Cookies.get("loggedinId") + "/articles",
			type: "POST",
			dataType: 'json',
			data: attackData
		}).done( getArticles );


	}



	var deleteClickNYTArticle = function() {
		
		var removeNYT = $('.remove-nyt');

		for (i = 0; i < removeNYT.length; i++) {
			$(removeNYT[i]).click(deleteNYTArticle);
		}
	}

	var deleteNYTArticle = function() {
		var nyt_id = $(this).parent().attr('data-id');

		$.ajax({
			url: "/users/" + Cookies.get("loggedinId") + "/nyt/" + nyt_id,
			type: "DELETE",
			dataType: "json"
		}).done(function(){
			$('.saved-nyt-articles').empty();
			getArticles();
		});

	}

	// var deleteClickDroneArticle = function() {
	// 	var removeDroneArticle = $('.remove-article');
	// 	for (i = 0; i < removeDroneArticle.length; i++) {
	// 		$(removeDroneArticle[i]).click(deleteDroneArticle);
	// 	}
	// }

	var deleteDroneArticle = function() {
		var article_id = $(this).parent().attr('data-id');
		console.log(article_id);

		$.ajax({
			url: "/users/" + Cookies.get("loggedinId") + "/articles/" + article_id,
			type: "DELETE",
			dataType: "json"
		}).done(function(){
			console.log('artice deleted');
			$('.saved-articles').empty();
			getArticles();
		})
	}

	




});



