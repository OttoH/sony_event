var file = require("./config.js").db_file;
var persist = require("persist");
var Person = require('../model/Person.js');

module.exports = function() {
    persist.connect({
        driver: 'sqlite3',
        filename: file,
        trace: false
    }, function(err, connection) {
        
        Person.all(connection, function(err, person) {
            if (!err) {
                console.log(person);
            } else {
                console.log(err);    
            }
        });
      
        connection.close();
    });
};