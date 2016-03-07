import Ember from 'ember';

var gui = window.requireNode('nw.gui');

export default Ember.Controller.extend({
  api: Ember.inject.service(),
  avahi: Ember.inject.service(),
  conectividad: Ember.inject.service(),
  apiStatus: Ember.computed.reads('api.isAlive'),
  avahiStatus: Ember.computed.reads('avahi.isAlive'),
  notApiStatus: Ember.computed.not('api.isAlive'),
  notAvahiStatus: Ember.computed.not('avahi.isAlive'),
  onLine: Ember.computed.reads('conectividad.onLine'),
  offLine: Ember.computed.not('conectividad.onLine'),
  init(){
    var api = this.get('api');
    var avahi = this.get('avahi');
    var conectividad = this.get('conectividad');

    api.iniciar();
    avahi.iniciar();
    conectividad.iniciar();

    this.disableBackSpace.call(true);
  },
  disableBackSpace: function() {
    Ember.$(document).on("keydown", function (e) {
      if (e.which === 8 && !Ember.$(e.target).is("input, textarea")) {
          e.preventDefault();
      }
    });
  }.on('init'),

  captureClose(){
    var win = gui.Window.get();
    win.on("close", () => {
      win.close(1);
      gui.App.closeAllWindows();
    });
  },

  actions:{
    goToServicios() {
      this.transitionToRoute('servicios');
    },

  }
});
