var vsGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "[hero] is always a bad choice with [opponent] on the other team.", 
        "[hero] is almost always a bad choice with [opponent] on the other team.",
        "[hero] is a bad choice most of the time with [opponent] on the other team.",
        "[hero] is often a bad choice with [opponent] on the other team.",
        "[hero] might not be a good choice with [opponent] on the other team.",
        "I don't know if picking [hero] is a good or bad idea.<br />No opinion.",
        "[hero] might be a good choice with [opponent] on the other team.",
        "[hero] is often a good choice with [opponent] on the other team.",
        "[hero] is a good choice most of the time with [opponent] on the other team.",
        "[hero] is almost always a good choice with [opponent] on the other team.",
        "[hero] is always a good choice with [opponent] on the other team."
    ];


    //--  Outgoing Events --//

    // Can be accessed from outside the module
    me.setQuote = function (value) {
        $("#vs-slide-quote").html(ratingQuotes[value]
            .replace('[hero]', hero.name)
            .replace('[opponent]', opponent.name)
        );
    }

    me.setupInterface = function (data) {
        hero = data.hero;
        opponent = data.opponent;
        var questionText = 'Would you recommend picking <span class="hero">' +
                            hero.name+'</span> with <span class="opponent">'+
                            opponent.name+'</span> on the other team?';
        $("#vs-title").html(questionText);
        $("#vs-hero-name").html('<span class="hero-subtitle">' + hero.name + '</span>');
        $("#vs-opponent-name").html('<span class="opponent-subtitle">' + opponent.name + '</span>');
        $("#vs-slide-val").html(5);
        $("#vs-hero-img").html('<img src="/images/thumbnails/' + hero.tag + '.png" />');
        $("#vs-opponent-img").html('<img src="/images/thumbnails/' + opponent.tag + '.png" />');
        me.setQuote(5, hero.name);
    }


    $('#vs-slider').rangeslider({
        polyfill: false,

        onSlide: function(position, value) {
            $("#vs-slide-val").html(value);
            if (hero) {
                me.setQuote(value, hero.name);
            }
        },

    });

    $("#vs-next .btn").on('click', function() {
        var data = {
            socketID: client.socketID,
            hero: hero.id,
            opponent: opponent.id,
            vote: parseInt($("#vs-slider").val()),
            type: 'matchups'
        }
        $("#vs-slider").val(5).change();

        socketHelper.emit('vote', data);
        main.nextGame();
    });

    return me;

}());