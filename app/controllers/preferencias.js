import Ember from 'ember';

export default Ember.Controller.extend({
  avatar: "",

  activate() {
    this.set("avatar", "http://localhost:9919/avatar?random" + Math.random());
  }
});
