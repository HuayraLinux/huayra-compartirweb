module.exports = function() {
	
	var express = require('express');
	var fs = require('fs');
	var path = require('path');
	var mime = require('mime');
	var url = '';
	
	var directorio_mis_archivos = '/Users/hugoruscitti/Downloads/';
	
	var app = express();
	
	app.all('/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});
	
	
	function obtener_tipo(stat) {
		if (stat.isDirectory())
			return 'folder';
		
		return "file";
	}
	
	app.get('/', function(req, res) {
			
		fs.readdir(directorio_mis_archivos, function(error, files) {
			var archivos = [];
			
			for (i=0; i<files.length; i++) {
				var stat = fs.statSync(path.join(directorio_mis_archivos, files[i]));
				
				archivos.push({
					name: files[i],
					type: obtener_tipo(stat),
					size: stat.size,
				});
			}
		
			/* El resultado es de la forma:
			 *
			 * {
			 *    archivos: [
			 *                 {name: 'un nombre',
			 *                  size: 1231,
			 *                  type: 'folder',
			 *                 },
			 *                  ...
			 *              ];
			 * }
			 *
			 */
			res.send({archivos: archivos});
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