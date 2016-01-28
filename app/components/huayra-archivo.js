import Ember from 'ember';

export default Ember.Component.extend({
  archivo: null,

  esDirectorio: Ember.computed('archivo',  function() {
    return this.get('archivo.type') === "folder";
  })
});
