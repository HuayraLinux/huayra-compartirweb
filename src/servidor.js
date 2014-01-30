var express = require('express');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require('url');
var http = require('http');
var os = require('os');
var polo = require('polo');


var servidor = function iniciarServidor(cuando_se_conecta_un_equipo,  
																				cuando_se_desconecta_un_equipo, 
																				puerto) {
	
	this.configurar_acceso_desde_cualquier_host = function() {
		this.app.all('/', function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "X-Requested-With");
			next();
		});
	}
	
	this.obtener_puerto_aleatorio = function() {
		return Math.floor(Math.random() * 2000) + 8080;
	}
	
	this.iniciar = function(numero_de_puerto) {
		var server = http.createServer(this.app);
		this.puerto = numero_de_puerto || this.obtener_puerto_aleatorio();
		this.base_url = "http://localhost:" + this.puerto;
	
		server.listen(this.puerto);
		this.base = "http://localhost:" + this.puerto;
		console.log("Iniciando el servicio en: " + this.base_url);
 	}
	
	
	/* Informa el tipo de archivo dado un indicador de archivo. */
	this.obtener_tipo = function(stat) {
		if (stat.isDirectory())
			return 'folder';
		
		return "file";
	}
	
	this.es_directorio = function(ruta_archivo) {
		var stat = fs.statSync(ruta_archivo);
		return (this.obtener_tipo(stat) == 'folder');
	}
	
	/* Construye una lista de archivos especificando el tamaño, nombre y tipo de cada
	 * archivos. Se utiliza para construir una estructura de datos que se pueda
	 * retornar al script cliente y visualizar un listado de archivos.
	 *
	 * Esta función también se asegura de poner a los directorios al principio del
	 * listado y a los archivos después.
	 */
	this.generar_listado_tipado_de_archivos = function(directorio_base, path_base, listado) {
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
				var tipo = this.obtener_tipo(stat);
				var registro = {
					name: listado[i],
					type: tipo,
					url : url.resolve(path_base + '/', listado[i]),
					size: stat.size,
				}
				
				if (tipo === 'folder')
					directorios.push(registro);
				else
					archivos.push(registro);
			}
		
		return directorios.concat(archivos);
	}
	
	
	this.configurar_rutas = function() {
		var self = this;
		
		this.app.get('/', function(req, res) {
				res.send({
					archivos: self.base + "/obtener/",
					avatar: self.base + "/avatar",
				});
		});
		
		
		this.app.get(/^\/obtener\/(.*)/, function(req, res) {
			var ruta = req.params[0] || "";
			var path_base = req.protocol + "://" + req.get('host') + req.url;
		
			var ruta_completa = path.join(self.directorio_compartido, ruta);
			
			if (self.es_directorio(ruta_completa)) {
				var listado = fs.readdirSync(ruta_completa);
				var archivos = self.generar_listado_tipado_de_archivos(ruta_completa, path_base, listado);
			
				res.send({
					archivos: archivos,
					cantidad: archivos.length
				});
			} else {
				self.enviar_archivo(res, ruta_completa);
			}
		});
		
	}
	
	this.enviar_archivo = function(res, ruta_completa) {
		var nombre_archivo = path.basename(ruta_completa);
		var mimetype = mime.lookup(ruta_completa);
		var stat;
		var size;
		var emited = 0;
		var porcentaje_emitido = 0;
		var porcentaje_emitido_anterior = -1;
		
		stat = fs.statSync(ruta_completa);
		size = stat.size;
	
		res.setHeader('Content-disposition', 'attachment; filename=' + nombre_archivo);
		res.setHeader('Content-type', mimetype);
	
		var stream = fs.createReadStream(ruta_completa, {'bufferSize': 1 * 1024});
		stream.pipe(res);
	
		console.log("Empezando a transferir el archivo ...");
		stream.on('readable', function() {});

		stream.on('data', function(chunk) {
			/*
			emited += parseInt(chunk.length, 10);
			porcentaje_emitido = Math.floor((emited * 100) / size);
	
			if (porcentaje_emitido != porcentaje_emitido_anterior) {
				console.log("%d por ciento", porcentaje_emitido);
				porcentaje_emitido_anterior = porcentaje_emitido;
			}
			*/
		});

		stream.on('end', function() {
			console.log("Terminó la transferencia del archivo.");
		});
		
	}
	
		
	// Inicializador.
	this.base_url = ''; // TODO: ELIMINAR....
	this.base = "";
	this.puerto = ''; // se define su valor cuando se llama al metodo this.iniciar()
	this.directorio_compartido = '/Users/hugoruscitti/Downloads/';
	
	// Inicia el servicio http.
	this.app = express();
	this.configurar_acceso_desde_cualquier_host();
	this.iniciar();
	
	// Publica en la red que el servicio http está online.
	console.log("Publicando en la red que el servicio está online.");
	this.polo = polo();
	
	this.polo.on('up', cuando_se_conecta_un_equipo);
	this.polo.on('down', cuando_se_desconecta_un_equipo);
	
	this.polo.put({
		name: 'huayra-compartir',
		version: 0.1,
		host: os.hostname(),
		port: this.puerto
	});
	
	
	// Genera la interfaz de rutas.
	this.configurar_rutas();	
	
	return this;
}

	
module.exports = servidor;