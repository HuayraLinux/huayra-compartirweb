import Ember from 'ember';

export default Ember.Route.extend({

  model(params) {
    var host = params.host;
    return $.getJSON(`http://${host}:9919/obtener/`);
  },

});
