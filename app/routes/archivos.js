import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    path: {
      refreshModel: true,
    },
    host: {
      refreshModel: true,
    }
  },

  model(params) {
    return $.getJSON(`http://${params.host}:9919/obtener/${params.path}`);
  },

  actions: {
    volver() {
      window.history.back();
    },
    actualizar() {
      this.refresh();
    }
  }
});
