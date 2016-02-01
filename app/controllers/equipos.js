import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    vincular() {
      var ip = prompt("Ingrese la dirección IP del equipo: ", "192.168.10.1");

      if (ip) {
        $.ajax({
          url: "http://localhost:9919/equipos",
          type: 'post',
          dataType: 'json',
          data: {host: ip, id: Math.trunc(Math.random() * 1000000000)},
          success: () => {
            this.send('actualizar');
          }
        });
      }
    }
  }
});
