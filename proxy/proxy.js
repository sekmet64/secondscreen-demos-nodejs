var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({target:'http://127.0.0.1:8000'});
var wsProxy = httpProxy.createProxyServer({target:'http://127.0.0.1:8001'});



proxy.on('error', function(e) {
  console.log(e);
});

var proxyServer = http.createServer(function (req, res) {
    // normal HTTP goes to proxy
    //console.log('   app   - http forwarded to 8000');

    proxy.web(req, res);
});

proxyServer.on('upgrade', function (req, socket, head) {
    console.log((new Date()) + ' Connection from origin ' + req.origin + '.');

    wsProxy.ws(req, socket, head);
});


proxyServer.listen(3000);
console.log("listening on port 3000");


















/**
 * Generates a random ID.
 *
 * TODO: check that the random ID is not already in use to make it unique.
 */
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var i;

  for (i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}