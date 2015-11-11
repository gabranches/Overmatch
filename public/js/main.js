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

function pickGame () {
	return Math.floor(Math.random() * 3.5);
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
function attachGame (num) {
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

function nextGame () {
	$("#vs-game-div").hide();
	$("#team-game-div").hide();
	$("#solo-game-div").hide();
	$('#loading-div p').html('Getting next match');
	$('#loading-div').show();
	$('#loading-div-bottom').show();

	socketHelper.emit('status-request', client);

	var game = pickGame();
	loadGame(game);

	setTimeout(function() {
	    $('#loading-div p').append('.');
		    setTimeout(function() {
		    $('#loading-div p').append('.');
		    	setTimeout(function() {
		    	    $('#loading-div p').append('.');
			    	    setTimeout(function() {
			    	        attachGame(game);
		        }, 300);
		    }, 300);
		}, 300);
	}, 300);
	
		

}


function populateDropdowns() {

	var heroesSorted = heroes.sort(function(a, b) {
	    var textA = a.tag.toUpperCase();
	    var textB = b.tag.toUpperCase();
	    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
	});

	heroesSorted.forEach(function(hero) {
		$(".hero-dropdown").append('<option value="'+hero.id+'">'+hero.name+'</option>');
	});

}

$(document).ready(function () {
	setBackground();
	nextGame();
	populateDropdowns();

});