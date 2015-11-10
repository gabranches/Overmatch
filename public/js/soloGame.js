var soloGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "I would never pick [hero].", 
        "I would only pick [hero] as an absolute last resort.",
        "I think [hero] is weak in this situation.",
        "I think [hero] has some flaws in this situation.",
        "I think [hero] might not be good here, but I'll try to make it work.",
        "I don't know if [hero] is good or bad in this situation.",
        "I think [hero] might be good here.",
        "I would pick [hero] often.",
        "I would pick [hero] most of the time",
        "I would pick [hero] almost every time.",
        "[hero] would be a guaranteed pick."
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
        var questionText = 'How likely are you to pick <span class="hero">' +
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
            me.setQuote(value, hero.name);
        },

    });

    $("#solo-next").on('click', function() {
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
        nextGame();
    });

    return me;

}());