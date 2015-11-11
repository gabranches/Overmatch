
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
        client.socketID = socket.io.engine.id;
        return socket.io.engine.id;
    }


    //-- Connection Event --//

    // Send client info to server
    socket.on('connect', function () { 
        me.getSocketID()
        socket.emit('user-connect', client);
        socket.emit('status-request', client);

        // Check connection
        setInterval(function () {
            if (!(socket.connected)) {
                alert('Connection lost, please refresh the page.');
            }
        }, 5000);
    });


    //-- Incoming Events --//

    // Receive message from server
    socket.on('vs-data', function (data){
        vsGame.setupInterface(data);
    });
    
    socket.on('solo-data', function (data){
        soloGame.setupInterface(data);
    });

    socket.on('team-data', function (data){
        teamGame.setupInterface(data);
    });

    socket.on('status', function (data){
        $('#active-count').html('Active users: ' + data.num_active);;
    });

    socket.on('all-stats', function (data){
        heroStats = data;
        stats.populateHeroStats(data);
    });

    socket.on('team-picks-data', function (data){
        heroStats['team'] = data;
        stats.populateTeamStats(data);
    });




    return me;

}());