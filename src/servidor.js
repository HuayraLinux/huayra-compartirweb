module.exports = function() {
	
	var express = require('express');
	var fs = require('fs');
	var path = require('path');
	var mime = require('mime');
	var url = '';
	
	var app = express();
	
	app.all('/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});
	
	app.get('/', function(req, res) {
    res.send({
			archivos: [
				{type: 'folder',
				 name: 'peliculas',
				 size: '50'
				},
				{type: 'text',
				 name: 'holamundo.txt',
				 size: '123'
				},
			]
		});
	});
	
	function iniciar() {
		var server = require('http').createServer(app);
		var puerto = obtener_puerto_aleatorio();
		
		this.url = "http://localhost:" + puerto;
	
		server.listen(puerto);
		console.log("Iniciando el servicio en: " + this.url);
	}

	function obtener_puerto_aleatorio() {
		return Math.floor(Math.random() * 2000) + 8080;
	}
	
	return {
		iniciar: iniciar,
		url: url
	}
}();



/*
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
*/