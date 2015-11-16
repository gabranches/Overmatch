var soloGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "[hero] is always a bad choice in this situation.", 
        "[hero] is almost always a bad choice in this situation.",
        "[hero] is a bad choice most of the time in this situation.",
        "[hero] is often a bad choice in this situation.",
        "[hero] might not be a good choice in this situation.",
        "I don't know if [hero] is good in this situation.<br />No opinion.",
        "[hero] might be a good choice in this situation.",
        "[hero] is often a good choice in this situation.",
        "[hero] is a good choice most of the time in this situation.",
        "[hero] is almost always a good choice in this situation.",
        "[hero] is always a good choice in this situation."
    ];


    //--  Outgoing Events --//

    // Can be accessed from outside the module
    me.setQuote = function (value, hero) {
        $("#solo-slide-quote").html(ratingQuotes[value].replace('[hero]', hero));
    }


    me.setupInterface = function (data) {
        hero = data.hero;
        opponent = data.opponent;
        strat = opponent.strat;
        var questionText = 'Do you recommend picking <span class="hero">' +
                            hero.name +'</span> on <span class="map">' +
                            opponent.name +' (' + opponent.type + ')' +'</span> while on <span class="strat">' +
                            strat + '</span>?';


        $("#solo-title").html(questionText);
        $("#solo-hero-name").html('<span class="hero-subtitle">' + hero.name + '</span>');
        $("#solo-map-name").html('<span class="map-subtitle">' + opponent.name + ': ' + strat + '</span>');
        $("#solo-slide-val").html(5);
        $("#solo-hero-img").html('<img src="/images/thumbnails/' + hero.tag + '.png" />');
        $("#solo-map-img").html('<img src="/images/maps/' + opponent.tag + '.jpg" />');
        me.setQuote(5, hero.name);
    }


    $('#solo-slider').rangeslider({

        polyfill: false,

        onSlide: function(position, value) {
            $("#solo-slide-val").html(value);
            if (hero) {
                me.setQuote(value, hero.name);
            }
        },

    });

    $("#solo-next .btn").on('click', function() {
        var data = {
            socketID: client.socketID,
            hero: hero.id,
            opponent: opponent.id,
            strat: strat,
            vote: parseInt($("#solo-slider").val()),
            type: 'maps'
        }
        $("#solo-slider").val(5).change();

        socketHelper.emit('vote', data);
        main.nextGame();
    });

    return me;

}());