import Ember from 'ember';

export default Ember.Component.extend({
  path: null,

  partes: Ember.computed('path', function() {
    var partes_de_la_ruta = this.get('path').split('/');

    partes_de_la_ruta = $.map(partes_de_la_ruta, (e) => {
      return decodeURI(e);
    });

    return partes_de_la_ruta;
  })
});
