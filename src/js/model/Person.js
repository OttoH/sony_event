var persist = require('persist');
var type = persist.type;

module.exports = persist.define('Person', {
  'name': type.STRING,
  'phone': type.STRING,
  'is_pass': type.INTEGER,
  'is_award': type.INTEGER
});
