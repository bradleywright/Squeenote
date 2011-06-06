var sys = require('sys');
var Server = require("./squeenote/server").Server;

// Start the Squeenote server
this.listen = function(presentation_path, presenter_password, port, static_path) {
  var s = new Server(presentation_path, presenter_password, static_path);
  s.listen(port);
}