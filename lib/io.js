var Game = require('./game.js');
var dbTransactions = require('./dbTransactions.js')();
var stats = require('./stats.js')();


module.exports = function (io) {

    var emitMessage = function (recipient, channel, data) {
        io.to(recipient).emit(channel, data);
    }

    var connectionCounter = 0;
    
    // Handles all socket.io requests
    io.on('connection', function (socket) {

        var userIP = socket.request.connection.remoteAddress;
        console.log('user ' + socket.id + ' (' + userIP + ') connected');
        connectionCounter++;

        //-- Game Initializers --/
       
        // Create a vs matchup
        socket.on('get-vs-data', function (client) {
            game = new Game('vs');
            matchup = game.createMatchup();
            emitMessage(client.socketID, 'vs-data', matchup)
        });

        // Create a solo game
        socket.on('get-solo-data', function (client) {
            game = new Game('solo');
            matchup = game.createSolo();
            emitMessage(client.socketID, 'solo-data', matchup)
        });

        // Create a team matchup
        socket.on('get-team-data', function (client) {
            game = new Game('team');
            matchup = game.createTeam();
            emitMessage(client.socketID, 'team-data', matchup)
        });


        //-- Game Votes --//

        // VS Game vote
        socket.on('vote', function(data) {
            data.userIP = userIP;
            if (dbTransactions.validateVote(data)) {
              
                // Also write the reversed data
                if (data.type === 'matchups') {

                    dbTransactions.writeData(data, 'matchups');

                    var reversed = {
                        socketID: data.socketID,
                        hero: data.opponent,
                        opponent: data.hero,
                        vote: 10 - data.vote
                    }

                    dbTransactions.writeData(reversed, 'matchups');

                } else if (data.type === 'friends') {

                    dbTransactions.writeData(data, 'friends');

                    var reversed = {
                        socketID: data.socketID,
                        hero: data.opponent,
                        opponent: data.hero,
                        vote: data.vote
                    }

                    dbTransactions.writeData(reversed, 'friends');

                } else {
                    dbTransactions.writeData(data, 'maps');
                }
            }

            // Get info for last match
            var matchups = stats.getMatchups(data.hero, 30);
            var result = dbTransactions.getElement(matchups[data.type], 'id', data.opponent);
            result.avg = ((result.avg*result.num) + data.vote) / (result.num + 1);
            result.num += 1;
            result.hero = data.hero;
            result.opponent = data.opponent;
            result.type = data.type;
            emitMessage(data.socketID, 'last-match', result);

        });


        // Handle status update
        socket.on('status-request', function(client) {
            var data = {
                num_active: connectionCounter,
            };
            emitMessage(client.socketID, 'status', data)
        });


        // Hero stats requests
        socket.on('get-all-stats', function(data) {
            console.log(data.hero);
            var result = stats.getMatchups(data.hero, data.days);
            console.log(result);
            emitMessage(data.client.socketID, 'all-stats', result);
        });

        // Team stats request
        socket.on('team-picks', function(data) {
            console.log(data.client);
            console.log(data.picks);

            var opponentsArr = [];
            data.picks.team.forEach(function (hero) {
                if (hero != ''){
                    opponentsArr.push(parseInt(hero));
                }
            });

            var result = stats.suggestPick(opponentsArr, data.picks.map, data.picks.type, data.picks.days);
            console.log('Results:');
            console.log(result);
            emitMessage(data.client.socketID, 'team-picks-data', result);
        });

        socket.on('disconnect', function () {
            console.log('user ' + socket.id + ' (' + userIP + ') disconnected');
            connectionCounter--;
            dbTransactions.removeFromRecentVotes(userIP);
        });

    });
}