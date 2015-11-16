var teamGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "[hero] is always a bad choice with [opponent] on my team.", 
        "[hero] is almost always a bad choice with [opponent] on my team.",
        "[hero] is a bad choice most of the time with [opponent] on my team.",
        "[hero] is often a bad choice with [opponent] on my team.",
        "[hero] might not be a good choice with [opponent] on my team.",
        "I don't know if picking [hero] is a good or bad idea.<br />No opinion.",
        "[hero] might be a good choice with [opponent] on my team.",
        "[hero] is often a good choice with [opponent] on my team.",
        "[hero] is a good choice most of the time with [opponent] on my team.",
        "[hero] is almost always a good choice with [opponent] on my team.",
        "[hero] is always a good choice with [opponent] on my team."    
    ];


    //--  Outgoing Events --//

    // Can be accessed from outside the module
    me.setQuote = function (value) {
        $("#team-slide-quote").html(ratingQuotes[value]
            .replace('[hero]', hero.name)
            .replace('[opponent]', opponent.name)
            );
    }

    me.setupInterface = function (data) {
        hero = data.hero;
        opponent = data.opponent;
        var questionText = 'Would you recommend picking <span class="hero">' +
                            hero.name+'</span> with <span class="friend">'+
                            opponent.name+'</span> on your team?';

        $("#team-title").html(questionText);
        $("#team-hero-name").html('<span class="hero-subtitle">' + hero.name + '</span>');
        $("#team-friend-name").html('<span class="friend-subtitle">' + opponent.name + '</span>');
        $("#team-slide-val").html(5);
        $("#team-hero-img").html('<img src="/images/thumbnails/' + hero.tag + '.png" />');
        $("#team-friend-img").html('<img src="/images/thumbnails/' + opponent.tag + '.png" />');
        me.setQuote(5, '');
    }


    $('#team-slider').rangeslider({
        polyfill: false,

        onSlide: function(position, value) {
            $("#team-slide-val").html(value);
            if (hero) {
                me.setQuote(value, hero.name);
            }
        },

    });

    $("#team-next .btn").on('click', function() {
        
        var data = {
            socketID: client.socketID,
            hero: hero.id,
            opponent: opponent.id,
            vote: parseInt($("#team-slider").val()),
            type: 'friends'
        }

        $("#team-slider").val(5).change();

        socketHelper.emit('vote', data);
        main.nextGame();
    });

    return me;

}());