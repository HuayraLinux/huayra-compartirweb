import Ember from 'ember';

export default Ember.Controller.extend({
  host: "",
  path: "",
  queryParams: ["host", "path"],

  esLocalhost: Ember.computed('host', function() {
    return (this.get("host") === "localhost" || this.get("host") === "127.0.0.1")
  }),

  no_puede_volver_atras: Ember.computed('path', function() {
    return this.get("path") === "";
  })
});
