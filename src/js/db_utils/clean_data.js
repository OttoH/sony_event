var file = require("./config.js").db_file;
var persist = require("persist");
var Person = require('../model/Person.js');

var queryAll = require('./query_all.js');

persist.connect({
        driver: 'sqlite3',
        filename: file,
        trace: false
    }, function(err, connection) {
        Person.deleteAll(connection, function(err) {
            if(err) {
                console.log(err);
            }
            queryAll();
        });
        
        connection.close();
    });