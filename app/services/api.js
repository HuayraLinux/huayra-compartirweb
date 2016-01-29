import Ember from 'ember';

export default Ember.Service.extend({
  equipos: [],

  obtenerEquipos() {
    return this.get('equipos');
  },

  agregarEquipo(objetoIP) {
    this.get('equipos').pushObject(objetoIP);
  }
});
