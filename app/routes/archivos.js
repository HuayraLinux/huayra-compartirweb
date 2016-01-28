import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    path: {
      refreshModel: true,
      host: true,
    }
  },

  model(params) {
    return $.getJSON(`http://${params.host}:9919/obtener/${params.path}`);
  },

  actions: {
    actualizar() {
      this.refresh();
    }
  }
});
