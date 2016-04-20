import Ember from 'ember';

export default Ember.Route.extend({
  conectividad: Ember.inject.service(),
  model() {
    return $.getJSON(`http://localhost:9919/equipos`);
  },
  activate(){
    this.get('conectividad').subscribe(this);
  },
  actions: {
    actualizar() {
      this.refresh();
    }
  }
});
