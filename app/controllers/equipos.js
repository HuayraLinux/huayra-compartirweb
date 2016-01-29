import Ember from 'ember';

export default Ember.Controller.extend({
  api: Ember.inject.service('api'),

  actions: {
    vincular() {
      var ip = prompt("Ingrese la dirección IP del equipo: ", "192.168.10.1");

      if (ip) {
        this.get('api').agregarEquipo({ip});
      }
    }
  }
});
