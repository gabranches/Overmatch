
//-- Socket IO front-end module --//

var socket = io();

var socketHelper = (function () {
    'use strict';
    var me = {};

    var socketID;

    //--  Outgoing Events --//

    // Can be accessed from outside the module
    me.emit = function (channel, data) {
        socket.emit(channel, data);
    }

    me.getSocketID = function() {
        client.socketID = '/#' + socket.io.engine.id;
        return socket.io.engine.id;
    }


    //-- Connection Event --//

    // Send client info to server
    socket.on('connect', function (err) { 
        console.log('connected');
        me.getSocketID();
        $('#disconnect-alert').hide();
        socket.emit('user-connect', client);
        socket.emit('status-request', client);
    });

    socket.on('connect_error', function (err) { 
        $('#disconnect-alert').show();
    });

    //-- Incoming Events --//

    // Receive message from server
    socket.on('vs-data', function (data){
        console.log('received game data');
        vsGame.setupInterface(data);
        main.attachGame(main.game);
    });
    
    socket.on('solo-data', function (data){
        console.log('received game data');
        soloGame.setupInterface(data);
        main.attachGame(main.game);
    });

    socket.on('team-data', function (data){
        console.log('received game data');
        teamGame.setupInterface(data);
        main.attachGame(main.game);
    });

    socket.on('status', function (data){
        console.log('received status');
        $('#active-count').html('Active users: ' + data.num_active);
    });

    socket.on('all-stats', function (data){
        heroStats = data;
        stats.populateHeroStats(data);
        $('html,body').animate({
           scrollTop: $("#hero-stats-title").offset().top
        });
    });

    socket.on('map-stats', function (data){
        mapStats = data;
        stats.populateMapStats(data);
        $('html,body').animate({
           scrollTop: $("#hero-stats-title").offset().top
        });
    });

    socket.on('team-picks-data', function (data){
        heroStats['team'] = data;
        stats.populateTeamStats(data);
        $('html,body').animate({
           scrollTop: $("#hero-stats-title").offset().top
        });
    });

    socket.on('last-match', function (data){
        $('#last-match').show();
        stats.populateLastMatch(data);
    });

    socket.on('graph-data', function (data){
        stats.generateChart(data);
    });

    return me;

}());