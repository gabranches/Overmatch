var vsGame = (function () {
    
    var me = {};

    var hero;
    var opponent;

    var ratingQuotes = [
        "There's no chance that I would pick [hero] against [opponent].", 
        "It's extremely unlikely that I would pick [hero] against [opponent].",
        "Most of the time, I would not pick [hero] against [opponent].",
        "I would not pick [hero] too often against [opponent].",
        "I may pick [hero] against [opponent], but I think I will be at a slight disadvantage.",
        "I don't know if [hero] is good against [opponent].<br />I think they are neural.<br />No opinion.",
        "I may pick [hero] against [opponent] because of a slight advantage.",
        "I would pick [hero] often against [opponent].",
        "I would pick [hero] most of the time against [opponent].",
        "I would pick [hero] almost always against [opponent].",
        "I would pick [hero] 100% of the time against [opponent]."
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
        var questionText = 'How likely are you to pick <span class="hero">' +
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