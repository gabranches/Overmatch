// Handles all requests that have to do with the hero stats panel

var stats = (function () {
    
    var me = {};
    var hero_id = '';
    var map_id = '';
    var map_tag = '';
    var stat_type = 'matchups';
    var map_strat = 'offense';

    me.appendToTable = function (data, counter) {
        if (data.avg) {
            var rating = data.avg.toFixed(2);
        } else {
            var rating = 0;
            rating = rating.toFixed(2);;
        }

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
        

        table.append('<div data-hero="'+hero_id+'" data-opponent="'+data.id+'" data-type="'+stat_type+'" class="table-row row data-row">' + count+ thumbnail + name + avg + votes + '</div>');
    }

    me.writeHeader = function (type) {

        if ((type) == 'friends') {
            type ='teammates';
        }

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
        } else if (stat_type === 'mapList') {
            table.append('<div class="table-row header-row row"><div class="col-xs-1 row-name">Rank</div>' + 
                         '<div id="row-map-type" class="col-xs-6 row-name text-center">'+mapStats.map.name + ': ' + mapStats.map.strat +'</div>' +
                         '<div class="col-xs-2 row-name text-center">Score</div>' +
                         '<div class="col-xs-3 row-name">Votes</div></div>');
        } else {
            table.append('<div class="table-row header-row row"><div class="col-xs-1 row-name">Rank</div>' + 
                         '<div class="col-xs-2 row-name"></div>' +
                         '<div class="col-xs-2 row-name text-left">'+ type +'</div>' +
                         '<div class="col-xs-4 row-name text-right">'+heroes[hero_id].name+'\'s Score</div><div class="col-xs-3 row-name">Votes</div></div>');
        }
    }

    me.populateLastMatch = function (data) {
        var picsHtml = '<img style="border: 1px solid rgba(108, 220, 255, 0.36);" src="/images/thumbnails/'+heroes[data.hero].tag+'.png" />';

        if (data.type === 'maps') {
            var picsHtml = picsHtml + '<img style="border: 1px solid rgba(255, 165, 0, 0.55)" src="/images/maps/'+maps[data.opponent].tag+'.jpg" />';
        } else if (data.type === 'matchups') {
            var picsHtml = picsHtml + '<img style="border: 1px solid rgba(255, 0, 0, 0.44);" src="/images/thumbnails/'+heroes[data.opponent].tag+'.png" />';
        } else if (data.type === 'mapList') {
            var picsHtml = picsHtml + '<img style="border: 1px solid rgba(255, 0, 0, 0.44);" src="/images/maps/'+maps[data.opponent].tag+'.jpg" />';
        } else {
            var picsHtml = picsHtml + '<img style="border: 1px solid rgba(108, 220, 255, 0.36);" src="/images/thumbnails/'+heroes[data.opponent].tag+'.png" />';
        }

        $('#last-match-pics').html(picsHtml);
        $('#last-match-score').html('Score: ' + data.avg.toFixed(2));
        $('#last-match-votes').html('Votes: ' + data.num);

    }

    me.populateMatchups = function (type) {
        $("#hero-stats-table").empty();
        me.writeHeader(type);
        $('#' + type + '-btn').addClass('menu-selected');
       
         for (var i=0; i < heroStats[type].length; i++) {
            me.appendToTable(heroStats[type][i], i+1);
        }

    }

    me.populateMapMatchups = function (type) {
        $("#hero-stats-table").empty();
        me.writeHeader('mapList');
        $('#' + type + '-btn').addClass('menu-selected');
       
         for (var i=0; i < mapStats['mapList'].length; i++) {
            me.appendToTable(mapStats['mapList'][i], i+1);
        }

    }

    // Populate results for the hero stats section
    me.populateHeroStats = function (data) {

        stat_type = 'matchups';
        $('#hero-stats').show();
        $("#hero-stats-menu").show();
        $("#map-stats-menu").hide();
        $('#hero-stats-name').append('<img src="/images/thumbnails/'+data.hero.tag+'.png" />');
        $('#hero-stats-name').html(heroStats.hero.name);
        me.populateMatchups(stat_type);
        
    }

    // Populate results for the map stats section
    me.populateMapStats = function (data) {
        stat_type = 'mapList';
        $('#hero-stats').show();
        $("#map-stats-menu").show();
        $("#hero-stats-menu").hide();
        $('#hero-stats-name').append('<img src="/images/maps/'+data.map.tag+'.jpg" />');
        $('#hero-stats-name').html(mapStats.map.name);
        $("#hero-stats-table").empty();
        me.writeHeader(stat_type);
        me.populateMapMatchups(map_strat);
        
    }

    // Populate results for the enemy counters and team picks section
    me.populateTeamStats = function (data) {
        stat_type = 'team';
         $("#map-stats-menu").hide();
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
        $('#map-stats-btn').removeClass('bigmenu-selected');
    }

    function clearMenuButtons() {
        $('#matchups-btn').removeClass('menu-selected');
        $('#counters-btn').removeClass('menu-selected');
        $('#teammates-btn').removeClass('menu-selected');
        $('#maps-btn').removeClass('menu-selected');
        $('#offense-btn').removeClass('menu-selected');
        $('#defense-btn').removeClass('menu-selected');
    }

    function clearPicSelection() {
        $('.pick-hero-thumb').removeClass('pic-selected');
        $('.pick-map-div').removeClass('map-selected');
    }

    me.setLoading = function (elem) {
        elem.html('Getting stats...');

    }

    //-- Event Handlers --//

    $(".pick-hero-thumb").click(function () {
        me.setLoading($('#hero-stats-name'));
        clearMenuButtons();
        clearPicSelection();
        $(this).addClass('pic-selected');
        hero_id = $(this).attr("data-id");
        $("#hero-stats-title").show();
        $("#beta").show();
        hero_id = heroes[hero_id].id;
        socketHelper.emit('get-all-stats', {hero: hero_id, client: client, days: settings.days});
    });

    $(".pick-map-div").click(function () {
        me.setLoading($('#hero-stats-name'));
        clearMenuButtons();
        clearPicSelection();
        $(this).addClass('map-selected');
        map_tag = $(this).attr("data-tag");
        $("#hero-stats-title").show();
        $("#beta").show();
        map_id = mapTagToId.indexOf(map_tag + '-' + map_strat);
        socketHelper.emit('get-map-stats', {map: map_id, client: client, days: settings.days});
    });


    // Big menu buttons

    $('#hero-stats-btn').click(function () {
        $("#pick-hero").show();
        $("#pick-team").hide();
        $("#pick-map").hide();
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });

    $('#map-stats-btn').click(function () {
        $("#pick-map").show();
        $("#pick-team").hide();
        $("#pick-hero").hide();
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });

    $('#team-counter-btn').click(function () {
        $("#pick-map").hide();
        $("#pick-team").hide();
        clearBigMenuButtons();
        $(this).addClass('bigmenu-selected');
    });

    $('#friendly-team-btn').click(function () {
        $("#pick-map").hide();
        $("#pick-team").hide();
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

    $("#defense-btn").click(function () {
        me.setLoading($('#hero-stats-name'));
        clearMenuButtons();
        stat_type = 'mapList';
        map_strat = 'defense';
        map_id = mapTagToId.indexOf(map_tag + '-' + 'defense');
        socketHelper.emit('get-map-stats', {map: map_id, client: client, days: settings.days});
    });

    $("#offense-btn").click(function () {
        me.setLoading($('#hero-stats-name'));
        clearMenuButtons();
        stat_type = 'mapList';
        map_strat = 'offense';
        map_id = mapTagToId.indexOf(map_tag + '-' + 'offense');
        socketHelper.emit('get-map-stats', {map: map_id, client: client, days: settings.days});
    });

   $('#days-selection').change(function () {
        var days = parseInt($(this).val());
        settings.days = days;
   });

    return me;

}());