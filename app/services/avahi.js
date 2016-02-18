import Ember from 'ember';

var HARDCODED_AVAHI_PATH = "/tmp/huayra-compartir-avahi/huayra-compartir-avahi.py";

var spawn = window.requireNode('child_process').spawn;
var ventana = window.requireNode('nw.gui').Window.get();


export default Ember.Service.extend({
  checkInterval: 5000,
  isAlive: false,
  child: null,
  iniciar(){
    if (this.get('child') !== null){ return; }
    else{
      var self = this;
      var cmd = '_BIN_PATH_'.replace('_BIN_PATH_', HARDCODED_AVAHI_PATH);
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
        console.log('AVAHI CLOSE');
        self.closeChild();
      });

      self.checkStatus();
    }
  },
  stillAlive(){
    var child = this.get('child');
    var alive = true;

    try{ process.kill(-child.pid, 0); }
    catch(e){ alive = false; }

    this.set('isAlive', alive);
  },
  checkStatus(){
    var self = this;
    setInterval(function(){ self.stillAlive(); }, this.get('checkInterval') );
  },
  closeChild(){
    var child = this.get('child');
    try{
      process.kill(-child.pid, 'SIGTERM');
    }
    catch(e){
      console.log("No he podido matar al proceso _PID_. Existe?".replace('_PID_', child.pid))
    }
    console.log("compartir-avahi cerrado.");
  }
});
