import Ember from 'ember';

export default Ember.Controller.extend({
  host: "",
  path: "",
  queryParams: ["host", "path"]
});
