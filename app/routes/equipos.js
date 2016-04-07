import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return $.getJSON(`http://localhost:9919/equipos`);
  },

  actions: {
    actualizar() {
      this.refresh();
    }
  }
});
