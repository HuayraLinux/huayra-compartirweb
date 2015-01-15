var express = require('express');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var url = require('url');
var http = require('http');
var os = require('os');
var polo = require('polo');
var crypto = require('crypto');
var uuid = require('node-uuid');
var spawn = require('child_process').spawn;


var POLO_HABILITADO = false;

app.factory("Descargas", function() {
    var descargas = [
    ];

    return descargas;
});

app.factory('Servidor', function(AmigosFactory, AvahiFactory, PreferenciasFactory, RedFactory) {

  function Servidor() {

    this.inyectar_dependencias = function(Eventos, data_preferencias, cuando_se_conecta_un_equipo, cuando_se_desconecta_un_equipo) {
      this.Eventos = Eventos;
      this.data_preferencias = data_preferencias;
      this.cuando_se_conecta_un_equipo = cuando_se_conecta_un_equipo;
      this.cuando_se_desconecta_un_equipo = cuando_se_desconecta_un_equipo;
    }

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

    this.obtener_ip = function() {
        return RedFactory.obtener_ip();
    }

    this.obtener_puerto = function() {
        return this.puerto
    }

    this.base_url = function(){
        return "http://" + this.obtener_ip() + ":" + this.puerto
    }

    this.iniciar_servidor = function(numero_de_puerto) {
        var server = http.createServer(this.app);
        this.puerto = numero_de_puerto || this.obtener_puerto_aleatorio();
        server.listen(this.puerto);
        console.log("Iniciando el servicio en: " + this.base_url());
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

                //console.log(registro);

                if (tipo === 'folder')
                    directorios.push(registro);
                else
                    archivos.push(registro);
            }

        return directorios.concat(archivos);
    }

    this.enviar_archivo = function(res, ruta_completa, notificar) {
        var notificar = typeof notificar !== 'undefined' ? notificar : true;

        var nombre_archivo = path.basename(ruta_completa);
        var mimetype = mime.lookup(ruta_completa);
        var stat;
        var size;
        var emited = 0;
        var porcentaje_emitido = 0;
        var porcentaje_emitido_anterior = -1;

        if (notificar) {
            var id = uuid.v1();
            this.Eventos.emit('inicia', {id: id, estado: 'warning', texto: "Enviando el archivo " + nombre_archivo});
        }

        stat = fs.statSync(ruta_completa);
        size = stat.size;

        res.setHeader('Content-disposition', 'attachment; filename=' + nombre_archivo);
        res.setHeader('Content-type', mimetype);

        var stream = fs.createReadStream(ruta_completa, {'bufferSize': 1 * 1024});
        stream.pipe(res);

        console.log("Iniciando la transferencia de: " + ruta_completa);
        stream.on('readable', function() {});

        stream.on('data', function(chunk) {
            emited += parseInt(chunk.length, 10);
            porcentaje_emitido = Math.floor((emited * 100) / size);

            if (porcentaje_emitido != porcentaje_emitido_anterior) {
                //console.log("%d por ciento", porcentaje_emitido);
                porcentaje_emitido_anterior = porcentaje_emitido;
            }
        });

      	var eventos = this.Eventos;
        stream.on('end', function() {
            if (notificar) {
                eventos.emit('finaliza', {id: id, estado: 'success', texto: "Terminó la transferencia del archivo: " + nombre_archivo});
            }
        });

    }

    this.configurar_rutas = function() {
        var self = this;

        this.app.get('/', function(req, res) {

            res.send({
                archivos: self.base_url() + "/obtener/",
                avatar: self.base_url() + "/avatar",
                nombre: PreferenciasFactory.nombre,
                frase: PreferenciasFactory.frase
            });
        });

        this.app.get(/^\/avatar/, function(req, res) {
            var ruta_completa = process.env.HOME + '/.huayra-compartir_avatar';

            fs.exists(ruta_completa, function(exists) {
                if (exists == false) {
                    self.enviar_archivo(res, './assets/img/avatar_por_omision.png', false);
                }
                else {
                    self.enviar_archivo(res, ruta_completa, false);
                }
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

    this.reiniciar_polo = function() {

      if (POLO_HABILITADO) {
        console.log("Reiniciando polo.");
        this.iniciar_servicio_polo();
      } else {
        console.log("Polo esta deshabilitado.");
      }

    }

    var self = this;

    this.iniciar_servicio_polo = function() {

      if (POLO_HABILITADO) {
        this.polo = polo({
            heartbeat: 5*1000
        });

        this.polo.on('up', this.cuando_se_conecta_un_equipo);
        this.polo.on('down', this.cuando_se_desconecta_un_equipo);

        function publicar_servicio() {
            self.polo.put({
              name: 'huayra-compartir',
              version: 0.2,
              host: os.hostname(),
              ip: self.obtener_ip(),
              id: self.data_preferencias.id,
              port: self.puerto
            });

            setTimeout(publicar_servicio, 15*1000);
        }

        publicar_servicio();
      } else {
        console.log("Polo esta deshabilitado");
      }

    }

    // Inicializador.
    this.Eventos = undefined;
    this.data_preferencias = undefined;
    this.cuando_se_conecta_un_equipo = undefined;
    this.cuando_se_desconecta_un_equipo = undefined;
    this.directorio_compartido = process.env.HOME + '/Compartido/';
    var self = this;

    this.iniciar = function() {
      // Genera el directorio compartido si no existe.
      if (! fs.existsSync(this.directorio_compartido))
          fs.mkdir(this.directorio_compartido);

      // Inicia el servicio http.
      this.app = express();
      this.configurar_acceso_desde_cualquier_host();
      this.iniciar_servidor();

      // Publica en la red que el servicio http está online.
      console.log("Publicando en la red que el servicio está online.");

      if (this.obtener_ip() !== "localhost") {
        this.iniciar_servicio_polo();

        AvahiFactory.iniciar();
        AvahiFactory.publicar_servicio_en_la_red(self.data_preferencias.id, self.obtener_ip(), self.puerto);
      }

      // Genera la interfaz de rutas.
      this.configurar_rutas();
    }
  }

  var servidor = new Servidor();
  return servidor;
});


app.factory('Eventos', function() {
  console.log("Creando el emisor de eventos!");
  var eventos = new events.EventEmitter();
  return eventos;
});


app.factory("Menu", function(AvahiFactory) {
    var menu = undefined;
    var tray = undefined;
    var animar_icono = false;

    function mostrar_ventana() {
        var ventana = gui.Window.get();
        ventana.show();
        ventana.restore();
    }

    function animar_icono(estado) {
        if (estado) {
            animar_icono = true;
        } else {
            animar_icono = false;
            tray.icon = "assets/img/icono_4.png";
        }
    }

    /**
     * Retorna la ruta completa al directorio de temas.
     */
    function obtener_prefijo_iconos(callback) {

      var comando = spawn('gsettings', ['get', 'org.mate.interface', 'icon-theme']);

      comando.stdout.on('data', function (data) {
        data = data.toString().trim().replace(/\'/g, '');
        var path = "/usr/share/icons/" + data + '/22x22/status/';
        var path_icon_idle = "/usr/share/icons/" + data + '/22x22/status/hcompartir-idle.png';
        var path_icon_transfer1 = "/usr/share/icons/" + data + '/22x22/status/hcompartir-transfer1.png';
        var path_icon_transfer2 = "/usr/share/icons/" + data + '/22x22/status/hcompartir-transfer2.png';

        var exists = fs.existsSync(path_icon_idle) && fs.existsSync(path_icon_transfer1) && fs.existsSync(path_icon_transfer2);

        if (exists) {
          //console.log("Se encontro el icono correctamente");
          callback(null, path);
        } else {
          //console.log("No se encontro icono en " + path);
          callback({error: "No se encontro alguno de los iconos en " + path + ". Usando iconos por omision."}, null);
        }
      });

      comando.stderr.on('data', function (reason) {
        callback(reason, null);
      });

      comando.on('close', function (code) {
      });

    }

    function crear() {
        var prefix = 'assets/img/'
        var numero = 1;

        tray = new gui.Tray({title: '', icon: prefix + 'hcompartir-idle.png' });

        function update_image() {

          obtener_prefijo_iconos(function(err, data) {
            if (err)
              prefix = "assets/img/";
            else
              prefix = data;
          });

          if (animar_icono) {
            if (numero === 1)
              numero = 2;
            else
              numero = 1;
            tray.icon = prefix + "hcompartir-transfer" + numero + ".png";
          } else {
            tray.icon = prefix + "hcompartir-idle.png";
          }

          //console.log(tray.icon);

          setTimeout(update_image, 2000);
        }

        update_image();

        menu = new gui.Menu();

        tray.on ('click',function() {
          mostrar_ventana();
        });

        menu.append(new gui.MenuItem({
          label: 'Mostrar',
          click: function() {
            mostrar_ventana();
          }
        }));

        menu.append(new gui.MenuItem({
          label: 'Salir',
          click: function() {
            AvahiFactory.terminar();
            gui.App.quit();
          }
        }));

        tray.menu = menu;
      }


    return {crear: crear,
            animar_icono: animar_icono};
});
