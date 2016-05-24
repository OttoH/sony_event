var file = require("./config.js").db_file;
var persist = require("persist");
var Person = require('../model/Person.js');
var queryAll = require('./query_all.js');

persist.connect({
        driver: 'sqlite3',
        filename: file,
        trace: false
    }, function(err, connection) {
        
        var data = [];
       
        data.push(new Person({
            name: 'admin',
            phone: '0900000000',
            is_pass: 1
        }));
        
        connection.save(data, function(err) {
            if (err) {
                console.log(err);
            }
            queryAll();
        });
      
        connection.close();
    });