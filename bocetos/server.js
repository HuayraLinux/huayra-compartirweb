var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var path = require('path');
var mime = require('mime');

console.log("Iniciando http://localhost:8080");
server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/descargar', function(req, res) {
  var file = '../../Movies/Peliculas/El\ viaje\ de\ Chihiro.avi';
	var filename = path.basename(file);
  var mimetype = mime.lookup(file);
	var stat;
	var size;
	var emited = 0;
  var porcentaje_emitido = 0;
  var porcentaje_emitido_anterior = -1;
	
	stat = fs.statSync(file);
	size = stat.size;

  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
	
  var stream = fs.createReadStream(file, {'bufferSize': 1 * 1024});
  stream.pipe(res);
	
  console.log("Empezando...");
	stream.on('readable', function() {});

  stream.on('data', function(chunk) {
		emited += parseInt(chunk.length, 10);
    porcentaje_emitido = Math.floor((emited * 100) / size);

    if (porcentaje_emitido != porcentaje_emitido_anterior) {
      console.log("%d por ciento", porcentaje_emitido);
      porcentaje_emitido_anterior = porcentaje_emitido;
    }
  });

  stream.on('end', function() {
    console.log("Terminó la transferencia del archivo.");
  });
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log(data);
    });
});
