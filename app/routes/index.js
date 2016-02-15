import Ember from 'ember';

export default Ember.Route.extend({
  systray: Ember.inject.service(),
  activate(){
    this.get('systray');
  },
});
