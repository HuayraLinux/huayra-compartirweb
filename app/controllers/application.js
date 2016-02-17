import Ember from 'ember';

var gui = window.requireNode('nw.gui');

export default Ember.Controller.extend({
  api: Ember.inject.service(),
  avahi: Ember.inject.service(),
  init(){
    var api = this.get('api');
    var avahi = this.get('avahi');

    api.iniciar();
    avahi.iniciar();

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
  }
});
