import Ember from 'ember';

export default Ember.Component.extend({
  archivo: null,
  ctrl: null,
  size: Ember.computed('archivo.size', function() {

    function humanFileSize(size) {
      var i = Math.floor( Math.log(size) / Math.log(1024) );

      if (size === 0) {
        return 0;
      }

      return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
    }

    return humanFileSize(this.get('archivo.size'));
  }),

  esDirectorio: Ember.computed('archivo',  function() {
    return this.get('archivo.type') === "folder";
  }),

  actions: {
    descargar() {
      window.location.href = this.get('archivo.descargar');
    },
    abrir() {
      var partes = this.get('archivo.contenido').split('/obtener/');
      var host = this.get('host');
      var path = partes[1];

      this.get('ctrl').transitionToRoute('archivos', {queryParams: {host, path}});
    }
  }

});
