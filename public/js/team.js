// Handles all requests that have to do with the hero stats panel

var teamModule = (function () {
    
    var me = {};
    var hero_id = '';
    me.picks = {
        type: '',
        team: [],
        map: '',
        days: ''
    };

  
    //-- Event Handlers --//

    $('#team-counter-btn').click(function() {
        me.picks.type = 'matchups';
        $('#pick-hero').hide();
        $('#pick-team').show();
        $('.dropdown-pic').css('color', 'rgb(255, 0, 0)');
        $('#instructions1').html('Pick an enemy team and map, and we\'ll suggest counter-picks. Start by picking <span class="opponent">up to 6 heroes</span> on the enemy team:')
        $('#instructions2').html('Now pick a <span class="map">map and strategy</span>:')
        $('#s6').show();
    });

    $('#friendly-team-btn').click(function() {
        me.picks.type = 'friends';
        $('#pick-hero').hide();
        $('#pick-team').show();
        $('.dropdown-pic').css('color', 'rgb(108, 220, 255)');
        $('#instructions1').html('Pick a friendly team and map, and we\'ll suggest picks with synergy. Start by picking <span class="hero">up to 5 heroes</span> on your team:')
        $('#instructions2').html('Now pick a <span class="map">map and strategy</span>:')
        $('#s6').hide();
    });

    $('.hero-dropdown').change(function() {
        var id = $(this).val();
        var picDiv = $(this).parent().parent().parent().find('.dropdown-pic');

        if (id != '') {
            picDiv.html('<img src="/images/thumbnails/'+heroes[id].tag+'.png" alt="'+heroes[id].name+'"/>')
        } else {
            picDiv.html('?');
        }
    });

    $('.map-dropdown').change(function() {
        var id = $(this).val();
        var picDiv = $('#map-dropdown-pic');
        if (id != '') {
            picDiv.html('<img src="/images/maps/'+maps[id].tag+'.jpg" alt="'+maps[id].name+'"/>')
        } else {
            picDiv.html('?');
        }
    });

    $('#team-submit').click(function () {

        if ($('.map-dropdown').val() != '') {
            $(this).html('Submitted!');
        } else {
            $(this).html('Pick a map!');
        }
        
        setTimeout(function () {
            $('#team-submit').html('Submit');
        }, 3000);

        $('.hero-dropdown').each(function () {
            me.picks.team.push($(this).val());
        })

        me.picks.map = $('.map-dropdown').val();
        me.picks.days = $('.days-dropdown').val();

        socketHelper.emit('team-picks', {client: client, picks: me.picks});
        me.picks.team = [];
    });


     return me;

}());