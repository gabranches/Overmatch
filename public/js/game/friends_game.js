var teamGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "They don't synergize at all and I would never pick [hero] with [opponent] on my team.", 
        "They have terrible synergy and I would only pick [hero] with [opponent] in rare situations.",
        "They syngergize poorly and are actually a detriment to the team.",
        "They synergize poorly, but may still be playable together ",
        "They may have synergy, but only in specific situations.",
        "I don't know if they work well together.<br />I think are neutral.<br />No opinion.",
        "They may have a bit of synergy in common situations.",
        "They have good synergy sometimes.",
        "They have very good synergy.",
        "They have excellent synergy.",
        "They have perfect synergy and I would pick [hero] with [opponent] on my team every time."
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
        var questionText = 'Do you think <span class="hero">' +
                            hero.name+'</span> has good synergy with <span class="friend">'+
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