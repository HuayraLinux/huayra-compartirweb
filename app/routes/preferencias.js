import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return $.get("http://localhost:9919/");
  },
  activate() {
    this.controllerFor("preferencias").activate();
  }
});
