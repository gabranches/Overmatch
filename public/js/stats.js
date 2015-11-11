// Handles all requests that have to do with the hero stats panel

var stats = (function () {
    
    var me = {};
    var hero_id = '';
    var stat_type = 'matchups';

    me.appendToTable = function (data, counter) {
        var rating = data.avg.toFixed(2);
        var table = $("#hero-stats-table");
        var count = '<div class="row-count col-xs-1">' + counter + '</div>';

        if (stat_type === 'maps') {
            var name = '<div class="row-map-name-title col-xs-2 text-left">' + maps[data.id].name +'</div>' +
                        '<div class="row-map-name col-xs-2 text-left">' + maps[data.id].type +'</div>' + 
                        '<div class="row-map-name col-xs-2 text-left">' + maps[data.id].strat +'</div>';
            var thumbnail = '';

        } else {
            var name = '<div class="row-name col-xs-4 text-left">' + heroes[data.id].name + '</div>';
            var thumbnail = '<div class="row-elmt col-xs-2"><img src="/images/thumbnails/' + 
                            heroes[data.id].tag + '.png" /></div>';
        }
        
        
        var avg = '<div class="row-avg col-xs-2">' + rating + '</div>';

        if (data.num < 10) {
            var votes = '<div title="There are not enough votes to make this ranking significant!" class="row-votes col-xs-3 warning">' + data.num + '</div>';
        } else {
            var votes = '<div class="row-votes col-xs-3">' + data.num + '</div>';

        }
        

        table.append('<div class="table-row row">' + count+ thumbnail + name + avg + votes + '</div>');
    }

    me.writeHeader = function (type) {
        var table = $("#hero-stats-table");

        if (stat_type === 'maps') {
            table.append('<div class="table-row header-row text-left row"><div class="col-xs-1 row-name"></div>' + 
                         '<div class="col-xs-2 row-name">Map</div>' +
                         '<div class="col-xs-2 row-name">Type</div>' +
                         '<div class="col-xs-2 row-name">Strat</div>' +
                         '<div class="col-xs-2 row-name text-center">Score</div>' +
                         '<div class="col-xs-3 row-name text-center">Votes</div></div>');

        } else if (stat_type === 'team') {
            table.append('<div class="table-row header-row row"><div class="col-xs-1 row-name">Rank</div>' + 
                         '<div id="row-map-type" class="col-xs-6 row-name text-center"></div>' +
                         '<div class="col-xs-2 row-name text-center">Score <span title="Scores are calculated by taking a weighted average of hero scores with map scores. Map scores have double the weight of one hero score." class="glyphicon glyphicon-info-sign"></span></div>' +
                         '<div class="col-xs-3 row-name">Votes</div></div>');
            $("#row-map-type").html($('#team-map option:selected').text());
        } else {
            table.append('<div class="table-row header-row row"><div class="col-xs-1 row-name">Rank</div>' + 
                         '<div class="col-xs-2 row-name"></div>' +
                         '<div class="col-xs-2 row-name text-left">'+ type +'</div>' +
                         '<div class="col-xs-4 row-name text-right">'+heroes[hero_id].name+'\'s Score</div><div class="col-xs-3 row-name">Votes</div></div>');
        }
    }

    me.populateMatchups = function (type) {
        $("#hero-stats-table").empty();
        me.writeHeader(type);
        $('#' + type + '-btn').addClass('menu-selected');
        
        for (var i=0; i < heroStats[type].length; i++) {
            me.appendToTable(heroStats[type][i], i+1);
        }

    }

    // Populate results for the hero stats section
    me.populateHeroStats = function (data) {
        stat_type = 'matchups';
        $('#hero-stats').show();
        $("#hero-stats-menu").show();
        $('#hero-stats-name').append('<img src="/images/thumbnails/'+data.hero.tag+'.png" />');
        $('#hero-stats-name').html(heroStats.hero.name);
        me.populateMatchups(stat_type);
        
    }

    // Populate results for the enemy counters and team picks section
    me.populateTeamStats = function (data) {
        stat_type = 'team';
        $('#hero-stats').show();
        $('#hero-stats-title').show();
        $('#hero-stats-name').html('Results');
        $("#hero-stats-menu").hide();
        me.populateMatchups('team');
        
    }

    function clearBigMenuButtons() {
        $('#hero-stats-btn').removeClass('bigmenu-selected');
        $('#team-counter-btn').removeClass('bigmenu-selected');
        $('#friendly-team-btn').removeClass('bigmenu-selected');
    }

    function clearMenuButtons() {
        $('#matchups-btn').removeClass('menu-selected');
        $('#counters-btn').removeClass('menu-selected');
        $('#teammates-btn').removeClass('menu-selected');
        $('#maps-btn').removeClass('menu-selected');
    }

    function clearPicSelection() {
        $('.pick-hero-thumb').removeClass('pic-selected');
    }

    //-- Event Handlers --//

    $(".pick-hero-thumb").click(function () {
        clearMenuButtons();
        clearPicSelection();
        $(this).addClass('pic-selected');
        hero_id = $(this).attr("data-id");
        $("#hero-stats-title").show();
        $("#beta").show();
        hero_id = heroes[hero_id].id;
        socketHelper.emit('get-all-stats', {hero: hero_id, client: client, days: settings.days});
    });

    // Big menu buttons

    $('#hero-stats-btn').click(function () {
        $("#pick-hero").show();
        $("#pick-team").hide();
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });

    $('#team-counter-btn').click(function () {
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });

    $('#friendly-team-btn').click(function () {
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });


    // Submenu buttons

    $("#matchups-btn").click(function () {
        clearMenuButtons();
        $(this).addClass('menu-selected');
        hero = heroes[hero_id].name;
        stat_type = 'matchups';
        me.populateMatchups(stat_type);
    });

    $("#counters-btn").click(function () {
        clearMenuButtons();
        $(this).addClass('menu-selected');
        hero = heroes[hero_id].name;
        stat_type = 'counters';
        me.populateMatchups(stat_type);
    });

    $("#teammates-btn").click(function () {
        clearMenuButtons();
        $(this).addClass('menu-selected');
        hero = heroes[hero_id].name;
        stat_type = 'friends';
        me.populateMatchups(stat_type);
    });

    $("#maps-btn").click(function () {
        clearMenuButtons();
        $(this).addClass('menu-selected');
        hero = heroes[hero_id].name;
        stat_type = 'maps';
        me.populateMatchups(stat_type);
    });


    return me;

}());