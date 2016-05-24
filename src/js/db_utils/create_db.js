var file = __dirname + '/' + 'sony.db';

var sqlite3 = require('sqlite3').verbose();
var persist = require("persist");
var Person = require('../model/Person.js');
var db = new sqlite3.Database(file);

db.serialize(function() {
    db.run('CREATE TABLE if not exists People (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT, is_pass INTEGER, is_award INTEGER)');
});

db.close();
