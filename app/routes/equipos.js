import Ember from 'ember';

export default Ember.Route.extend({
  api: Ember.inject.service('api'),

  model() {
    return this.get('api').obtenerEquipos();
  }
});
