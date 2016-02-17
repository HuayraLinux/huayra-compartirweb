import Ember from 'ember';

var HARDCODED_API_PATH = "/tmp/huayra-compartir-api/";

var spawn = window.requireNode('child_process').spawn;
var ventana = window.requireNode('nw.gui').Window.get();

export default Ember.Service.extend({
  host: 'localhost',
  port: 9919,
  routes:{
    root: '/',
    archivos: '/archivos',
    avatar: '/avatar/',
    descargar: '/descargar/',
    equipos: '/equipos/',
    obtener: '/obtener/'
  },
  child: null,
  iniciar(){
    if(this.get('child') !== null){ return; }
    else{
      var self = this;
      var cmd = '_PATH_bin/www'.replace('_PATH_', HARDCODED_API_PATH);
      var child = spawn(cmd, [],
                        {
                          env: process.env,
                          detached: true
                        });
      child.on('error', function(err){
        console.log(err);
      });
      this.set('child', child);

      ventana.on('close', function(){
        console.log('API CLOSE');
        self.closeChild();
      });
    }
  },
  closeChild(){
    var child = this.get('child');
    console.log(child.pid);
    try{
      process.kill(-child.pid, 'SIGTERM');
    }
    catch(e){
      console.log("No he podido matar al proceso _PID_. Existe?".replace('_PID_', child.pid))
    }
    console.log("compartir-api cerrado.");
  }
});
