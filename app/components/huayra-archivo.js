import Ember from 'ember';

export default Ember.Component.extend({
  archivo: null,
  ctrl: null,

  esDirectorio: Ember.computed('archivo',  function() {
    return this.get('archivo.type') === "folder";
  }),

  actions: {
    descargar() {
      window.location.href = this.get('archivo.descargar');
    },
    abrir() {
      var partes = this.get('archivo.contenido').split('/obtener/');
      var host = 'localhost'; //partes[0]; TODO: obtener el path desde esta ruta.
      var path = partes[1];

      this.get('ctrl').transitionToRoute('archivos', {queryParams: {host, path}});
    }
  }

});
