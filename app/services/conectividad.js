import Ember from 'ember';

var cp = window.requireNode('child_process');

export default Ember.Service.extend({
  systray: Ember.inject.service(),
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  nmcli: 'LANG=C nmcli -t -f state g',
  onLine: false,
  checkInterval: 5000,
  equipos: null,
  subscribe(equipos){
    this.set('equipos', equipos);
  }
  iniciar(){
    this.checkStatus();
  },
  status(){
    if( !this.get('systray').hidden ){
      var child = cp.execSync(this.get('nmcli'));
      var oldState = this.get('onLine');
      var newState = child.toString().trim() === this.get('CONNECTED');

      if( oldState != newState ){
        if ( this.get('equipos') !== null ){
           this.get('equipos').refresh();
        }
      }

      this.set('onLine', newState);
    }
  },
  checkStatus(){
    var self = this;
    setInterval(function(){ self.status(); }, this.get('checkInterval') );
  }
});
