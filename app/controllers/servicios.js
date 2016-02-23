import Ember from 'ember';

export default Ember.Controller.extend({
  api: Ember.inject.service(),
  avahi: Ember.inject.service(),
  apiStatus: Ember.computed.reads('api.isAlive'),
  avahiStatus: Ember.computed.reads('avahi.isAlive'),
  notApiStatus: Ember.computed.not('api.isAlive'),
  notAvahiStatus: Ember.computed.not('avahi.isAlive'),
  actions:{
    reiniciarApi(){
      var api = this.get('api');
      api.closeChild();
      api.iniciar();
    },
    reiniciarAvahi(){
      var avahi = this.get('avahi');
      avahi.closeChild();
      avahi.iniciar();
    }
  }
});
