import Ember from 'ember';

export default Ember.Route.extend({
  systray: Ember.inject.service(),
  api: Ember.inject.service(),
  activate(){
    // levantamos la api
    var api = this.get('api');
    // dibujamos al icono en el systray
    this.get('systray');
  },
});


