import Ember from 'ember';

export default Ember.Component.extend({
  item: null,
  ctrl: null,
  
  esta_bajando: Ember.computed("item.activo", function() {
    return (this.get("item.estado") === true);
  }),
  esta_esperando: Ember.computed("item.estado", function() {
    return (this.get("item.estado") === "esperando");
  }),
  ha_fallado: Ember.computed("item.estado", function() {
    return (this.get("item.estado") === "error");
  }),

});
