import Ember from 'ember';

export default Ember.Route.extend({
  systray: Ember.inject.service(),
  activate(){
    var systray = this.get('systray');
    var appController = this.controllerFor("application");
    appController.captureClose();
  }
});


