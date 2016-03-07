import Ember from 'ember';

var cp = window.requireNode('child_process');

export default Ember.Service.extend({
  systray: Ember.inject.service(),
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  nmcli: 'nmcli -t -f state g',
  onLine: false,
  checkInterval: 5000,
  iniciar(){
    this.checkStatus();
  },
  status(){
    if( !this.get('systray').hidden ){
      var child = cp.execSync(this.get('nmcli'));
      this.set('onLine', child.toString().trim() === this.get('CONNECTED'));
    }
    else{
      console.log('POOL OFF');
    }

  },
  checkStatus(){
    var self = this;
    console.log('POOL ON');
    setInterval(function(){ self.status(); }, this.get('checkInterval') );
  }
});
