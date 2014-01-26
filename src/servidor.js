module.exports = function() {
	
	var express = require('express');
	var fs = require('fs');
	var path = require('path');
	var mime = require('mime');
	var url = '';
	
	var directorio_mis_archivos = '/Users/hugoruscitti/Downloads/';
	
	var app = express();
	
	/* middleware para permitir acceso al servidor desde cualquier host. */
	app.all('/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	});
	
	
	/* Informa el tipo de archivo dado una ruta */
	function obtener_tipo(stat) {
		if (stat.isDirectory())
			return 'folder';
		
		return "file";
	}
	
	/* Construye una lista de archivos especificando el tamaño, nombre y tipo de cada
	 * archivos. Se utiliza para construir una estructura de datos que se pueda
	 * retornar al script cliente y visualizar un listado de archivos.
	 *
	 * Esta función también se asegura de poner a los directorios al principio del
	 * listado y a los archivos después.
	 */
	function generar_listado_tipado_de_archivos(directorio_base, listado) {
			var archivos = [];
			var directorios = [];
			
			/* Procesa cada uno de las cadenas buscando convertirlas en un diccionario
			 * que se almanece en 'archivos' o 'directorios' especificando nombre, tamaño
			 * y tipo del archivo procesado.
			 */
			for (i=0; i<listado.length; i++) {
				
				if (/^\./.test(listado[i]))  // Si es un archivo comenzado con '.' lo ignora.
					continue;
				
				var stat = fs.statSync(path.join(directorio_base, listado[i]));
				var tipo = obtener_tipo(stat);
				var registro = {
					name: listado[i],
					type: tipo,
					size: stat.size,
				}
				
				if (tipo === 'folder')
					directorios.push(registro);
				else
					archivos.push(registro);
			}
		
		return directorios.concat(archivos);
	}
	
	app.get('/ls', function(req, res) {
		var listado = fs.readdirSync(directorio_mis_archivos);
		var archivos = generar_listado_tipado_de_archivos(directorio_mis_archivos, listado);
		
		res.send({
			archivos: archivos,
			cantidad: archivos.length
		});
	});
	
	app.get(/^\/ls\/(.*)/, function(req, res) {
		var ruta = req.params[0] || "";
		console.log(ruta);
		
		var ruta_completa = path.join(directorio_mis_archivos, ruta);
		
		var listado = fs.readdirSync(ruta_completa);
		var archivos = generar_listado_tipado_de_archivos(ruta_completa, listado);
		
		res.send({
			archivos: archivos,
			cantidad: archivos.length
		});
	});
	
	app.get('/', function(req, res) {
		res.send({info: "usa el path /ls"});
	});
		
		
	function iniciar() {
		var server = require('http').createServer(app);
		var puerto = obtener_puerto_aleatorio();
		
		this.url = "http://localhost:" + puerto;
	
		server.listen(puerto);
		console.log("Iniciando el servicio en: " + this.url);
		window.document.title = window.document.title + " (" + puerto + ")";
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