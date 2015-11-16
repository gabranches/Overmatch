var main = (function () {

	me = {};

	me.game = '';

	function setBackground () {
		var bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

		$('body').css('background', 'url(/images/backgrounds/'+bg+'.jpg) no-repeat center center fixed');
		$('body').css('-webkit-background-size', 'cover');
		$('body').css('-moz-background-size', 'cover');
		$('body').css('-o-background-size', 'cover');
		$('body').css('background-size', 'cover');
	}

	function loadHeroes () {
		heroes.forEach(function (hero) {
			
			var heroHtml = '<div class="hero-div"></div>'
			$('#hero-pick').append();

		});
	}

	me.pickGame = function () {
		return Math.floor(Math.random() * 3);
	}

	function loadGame (num) {
		if (num === 0) {
			socketHelper.emit('get-vs-data', client);
		} else if (num === 1) {
			socketHelper.emit('get-team-data', client);
		} if (num >= 2) {
			socketHelper.emit('get-solo-data', client);
		} 

	}

	// Attaches a game to the front page div
	me.attachGame = function (num) {
		var num = num;

			$('#loading-div').hide();
			$('#loading-div-bottom').hide();
			if (num === 0) {
				$("#vs-game-div").show();
			} else if (num === 1) {
				$("#team-game-div").show();
			} if (num >= 2) {
				$("#solo-game-div").show();
			} 
	}

	me.nextGame = function () {
		$("#vs-game-div").hide();
		$("#team-game-div").hide();
		$("#solo-game-div").hide();
		$('#loading-div p').html('Getting next match');
		$('#loading-div').show();
		$('#loading-div-bottom').show();

		socketHelper.emit('status-request', client);

		me.game = me.pickGame();
		loadGame(me.game);
	}


	function populateDropdowns() {

		// Sort heroes array
		heroesSorted = heroes.slice();
		heroesSorted.sort(function(a, b) {
		    var textA = a.tag.toUpperCase();
		    var textB = b.tag.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});

		heroesSorted.forEach(function(hero) {
			$(".hero-dropdown").append('<option value="'+hero.id+'">'+hero.name+'</option>');
		});


		// Sort maps array
		mapsSorted = maps.slice();
		mapsSorted.sort(function(a, b) {
		    var textA = a.tag.toUpperCase();
		    var textB = b.tag.toUpperCase();
		    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});

		mapsSorted.forEach(function(map) {
			$(".map-dropdown").append('<option value="'+map.id+'">'+map.name+ ' (' + map.strat + ')</option>');
		});

	}

	$("#title").click(function() {
		window.location = '/';
	});

	$(document).ready(function () {
		setBackground();
		me.nextGame();
		populateDropdowns();

	});

	return me;

}());


// Google analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-58991641-3', 'auto');
  ga('send', 'pageview');