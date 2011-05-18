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
    client.password = '*******';
    
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
                    socket.write('creating new access token...\n');
                    
                    var accessToken = params[2] + params[1];
                    accessTokens[accessToken] = {
                        'some': 'Data',
                        'timeOut': null
                    };
                    
                    accessTokens[accessToken].timeOut = setTimeout(function() {
                        delete accessTokens[accessToken];
                    }, SESSION_TIMEOUT);
                    
                    socket.write('your token: "' + accessToken + '"\n' +
                    'Dit wordt natuurlijk compleet random, maar is nu als test even afleidbaar\n');
                } else {
                    socket.write('Usage: login <username> <password>\n');
                }
            } else if (params[0] == 'do') {
                if (1 in params) {
                    var token = params[1];
                    if (token in accessTokens) {
                        if (accessTokens[token].timeOut) {
                            clearTimeout(accessTokens[token].timeOut);
                        }
                        accessTokens[token].timeOut = setTimeout(function() {
                            delete accessTokens[token];
                        }, SESSION_TIMEOUT);
                        
                        socket.write('access granted and timeOut extended\n');
                    } else {
                        socket.write('access denied\n');
                    }
                }
            }
        });
    });
    server.listen(1337);
})();

/*client.query(
    'SELECT fapbaarheid FROM faaltabel ORDER BY RAND() LIMIT 15',
    function (err, results, fields) {
        if (err) throw err;
        
        for (var i in results) {
            (function(row) {
                console.log(row.fapbaarheid);
            })(results[i]);
        }
    }
);*/