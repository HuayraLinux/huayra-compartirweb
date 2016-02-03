import Ember from 'ember';

export default Ember.Controller.extend({
  avatar: "",
  guardando: false,

  activate() {
    this.set("avatar", "http://localhost:9919/avatar?random" + Math.random());
  },

  actions: {
    guardar() {
      var ctrl = this;
      this.set("guardando", true);

      var nombre = this.get("model.nombre");
      var frase = this.get("model.frase");

      function callback() {
        setTimeout(() => {
          ctrl.set("guardando", false);
        }, 2000);
      }

      $.post("http://localhost:9919/", {
        nombre: nombre,
        frase: frase
      }).then(callback, callback);


    }
  }
});
