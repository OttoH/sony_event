
var http = require('http');
var path = require('path');
var net = require('net');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

var persist = require('persist');
var Person = require('./src/js/model/Person.js');
var fs = require('fs');

var DB_CONFIG = {
  'driver': 'sqlite3',
  'filename': 'db_utils/sony.db',
  'defautFilename': 'db_utils/sony.db.default'
};

// DB Configuration
persist.setDefaultConnectOptions(DB_CONFIG);

//check if DB exists and create new one if it doesn't
if (!fs.existsSync(DB_CONFIG.filename)) {
  fs.createReadStream(__dirname + '/src/js/' + DB_CONFIG.defautFilename).pipe(fs.createWriteStream(__dirname + '/src/js/' + DB_CONFIG.filename));
}

router.get('/');

router.use(express.static(path.resolve(__dirname, 'src')));

// tcp server
var tcpClients = [];
var clients = [];
var tcpServer = net.createServer(function (c) {
	console.log('--tcp connected--');
	
	tcpClients.push(c);

	c.on('data', function(buffer) {
		var data = String(buffer);

		if (data.substring(0, 14) == 'HELLO/LISTENER') {
			console.log("Listener connected");
		}
	});

	c.on('end', function() {
		console.log('client disconnected');
		
		var index = tcpClients.indexOf(c);
		tcpClients.splice(index, 1);
	});

	c.on('error', function(e) {
		console.log('client error, disconnect', e);
		
		var index = tcpClients.indexOf(c);
		tcpClients.splice(index, 1);
	});
});
tcpServer.listen(7777, function() {
	console.log('server bound');
});


  /*
  "type": "lottery , start, stop",
  "event": "$timeStamp/serial",
  "name": "黃政豪",
  "phone": "090000000"
  */
// io setting
var data = [];
var sockets = [];
io.on('connection', function(socket) {

	sockets.push(socket);

	socket.on('disconnect', function() {
	  sockets.splice(sockets.indexOf(socket), 1);
	  updateRoster();
	});
	
	socket.on('register', function(person) {
	    persist.connect({
		    driver: 'sqlite3',
		    filename: __dirname + '/src/js/' + DB_CONFIG.filename,
		    trace: false
		  
	    }, function(err, connection) {
            Person.where('phone = ? and is_pass = ?', [person.phone, 1]).all(connection, function(err, people) {
                var isValid = true;

                if (people.length > 0) {
                    isValid = false;    
                }
	    	    socket.emit('check_register', {
		            isValid : isValid
		        });

                connection.close();
            });
        });
	});
	
	socket.on('pass', function(person) {

        var passPerson = [
            new Person({
                name: person.name,
                phone: person.phone,
                is_pass: 1,
                is_award: 0
            })
        ];

        // console.log('person' + person.name);
        // console.log('passPerson' + passPerson);
	    persist.connect({
		    driver: 'sqlite3',
		    filename: __dirname + '/src/js/' + DB_CONFIG.filename,
		    trace: false
		  
	    }, function(err, connection) {
            connection.save(passPerson, function(err) {
                if (err) {
                    console.log('save pass', err);
                } else {
		            socket.emit('confirm_pass', {
			            isValid: true
		            });
                }
            });

            connection.close();
	    });
    });

	socket.on('start', function() {
	  var data = {
		type: 'start'  
	  }
	  
	  try {
		var stringfyData = JSON.stringify(data);
		console.log('stringfy stop output: ', stringfyData);
		// broadcast('stop', JSON.stringify(data));
		
		if (tcpServer) {
			tcpClients.forEach(function(c) {
				c.write(stringfyData + '\n');
			});
		}
	  } catch (e) {
		console.log(e); 
	  }
	});

	socket.on('lottery', function(data) {
	  
	  persist.connect({
		  driver: 'sqlite3',
		  filename: __dirname + '/src/js/' + DB_CONFIG.filename,
		  trace: false
		  
	  }, function(err, connection) {
		  
		  Person.where('name != ? and is_pass = ? and is_award = ?', ['admin', 1, 0]).all(connection, function(err, person) {
			  if (!err && person && person.length > 0) {
				  // console.log('person: ', person);
                  var random = Math.floor(Math.random() * person.length) + 0;
				  
				  var data = {
					type: 'lottery',
					event: person[random].id || 'NA',
					name: person[random].name || 'NA',
					phone: person[random].phone || 'NA'
				  }
				  
				  try {
					var stringfyData = JSON.stringify(data);
					console.log('stringfy lottery output: ', stringfyData);
					// broadcast('lottery', JSON.stringify(data));

					if (tcpServer) {
						tcpClients.forEach(function(c) {
							c.write(stringfyData + '\n');
						});
					}

                    // contact control panel
                    broadcast('award_content', data);

				  } catch (e) {
					console.log(e); 
				  }

                  // upate award status
                  person[random].update(connection, {is_award: 1}, function(err) {
                    if (!err) {
                        console.log('save ' + person[random].name + ' status');
                    } else {
                        console.log('save ' + person[random].name + ' status error!');
                    }
                  });
				  
			  } else {
				console.log(err);    
				var data = {
			        type: 'lottery',
					event: 'NA',
					name: 'NA',
					phone: 'NA'
				}
                broadcast('award_content', data);
			  }
		  });
		
		  connection.close();
	  });
	});

	socket.on('clean', function() {
	  
	});  
	
	socket.on('stop', function() {
	  var data = {
		type: 'stop'  
	  }
	  
	  try {
		var stringfyData = JSON.stringify(data);
		console.log('stringfy stop output: ', stringfyData);
		// broadcast('stop', JSON.stringify(data));
		
		if (tcpServer) {
			tcpClients.forEach(function(c) {
				c.write(stringfyData + '\n');
			});
		}
	  } catch (e) {
		console.log(e); 
	  }
	});  
	  
  });

function updateRoster() {
  async.map(
	sockets,
	function (socket, callback) {
	  socket.get('name', callback);
	},
	function (err, names) {
	  broadcast('roster', names);
	}
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
	socket.emit(event, data);
  });
}

server.listen(7776, function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
