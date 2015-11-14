var vsGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "[hero] loses 100% of the time against [opponent].", 
        "[hero] almost always loses against [opponent].",
        "[hero] loses most of the time against [opponent].",
        "[hero] loses often against [opponent].",
        "[hero] would be slightly worse than [opponent].",
        "I don't know if [hero] would do well.<br />I think they are neutral.<br />No opinion.",
        "[hero] would be slightly better than [opponent].",
        "[hero] wins often against [opponent].",
        "[hero] wins most of the time against [opponent].",
        "[hero] wins almost always against [opponent].",
        "[hero] wins 100% of the time against [opponent]."
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
        var questionText = 'How do you think <span class="hero">' +
                            hero.name+'</span> matches up against <span class="opponent">'+
                            opponent.name+'</span>?';
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