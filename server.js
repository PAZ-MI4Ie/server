var Client = require('mysql').Client,
    client = new Client(),
    net = require('net'),
    SESSION_TIMEOUT = 10000;

function randomString(length) {
    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; ++i) {
        var randomPosition = Math.floor(Math.random() * characters.length);
        result += characters.substring(randomPosition, randomPosition + 1);
    }
    return result;
}
    
(function() {
    client.host = 'localhost';
    client.user = 'MI4Ie';
    client.password = '******';
    
    client.connect();
    
    client.query('USE MI4Ie');
    
    var accessTokens = {};
    
    var server = net.createServer(function (socket) {
        console.log('client connected from '+socket.remoteAddress);
        socket.setEncoding('utf8');
        socket.on('data', function(data) {
            var params = data.trim().split(' ');
            if (params[0] == 'login') {
                if (params.length == 3) {                    
                    var accessToken = params[2] + params[1];
                    accessTokens[accessToken] = {
                        'some': 'Data',
                        'timeOut': null
                    };
                    
                    accessTokens[accessToken].timeOut = setTimeout(function() {
                        delete accessTokens[accessToken];
                    }, SESSION_TIMEOUT);
                    
                    socket.write(accesToken + '\n');
                    socket.write('GO');
                }
            } else if (params[0] == 'addPair') {
                var pairdata = JSON.parse(data.trim().substring(8));
                //[{"username":"teuneboon","firstname":"Teun","surname":"Beijers","email":"teun@beijers.eu","number_of_guests":12,"studentnumber":13371},{"username":"ganonmaster","firstname":"Hidde","surname":"Jansen","email":"ganon@mastah.nl","number_of_guests":2,"studentnumber":13372}]
                if (pairdata.length == 2) {
                    insertStudent(pairdata[0], function(user1id) {
                        insertStudent(pairdata[1], function(user2id) {
                            client.query(
                                "INSERT INTO pair\n"+
                                "(student1, student2, number_of_guests)\n"+
                                "VALUES\n"+
                                "("+user1id+", "+user2id+", "+(parseInt(pairdata[0].number_of_guests) + parseInt(pairdata[1].number_of_guests))+")",
                                function (err, results, fields) {
                                    client.query(
                                    'SELECT LAST_INSERT_ID() AS pair_id',
                                    function(err, results, fields) {
                                        socket.write(results[0].pair_id);
                                        socket.write('GO');
                                    });
                                }
                            );
                        });
                    });
                }
            }
        });
    });
    server.listen(1337);
})();

function insertStudent(user, callBack) {
    client.query(
        "INSERT INTO user\n"+
        "(username, firstname, surname, email, user_type)\n"+
        "VALUES\n"+
        "('"+user.username+"', '"+user.firstname+"', '"+user.surname+"', '"+user.email+"', 'student')",
        function (err, results, fields) {
            client.query(
                "INSERT INTO student\n"+
                "(user_id, studentnumber)\n"+
                "VALUES\n"+
                "(LAST_INSERT_ID(),"+parseInt(user.studentnumber)+")",
                function (err, results, fields) {
                    if (callBack) {
                        client.query(
                            'SELECT LAST_INSERT_ID() AS user_id',
                            function(err, results, fields) {
                                callBack(results[0].user_id);
                            }
                        );
                    }
                }
            );
        }
    );
}
