import Ember from 'ember';

export default Ember.Route.extend({
  systray: Ember.inject.service(),
  menu: Ember.inject.service(),
  activate() {
    //var systray = this.get('systray');
    var menu = this.get('menu');
    var appController = this.controllerFor("application");
    appController.captureClose();

    menu.itemServicios.click = () => {
      this.send('goToServicios');
    };

    menu.itemServicios.enabled = true;
  }
});
