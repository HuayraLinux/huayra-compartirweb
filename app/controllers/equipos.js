import Ember from 'ember';

export default Ember.Controller.extend({
  api: Ember.inject.service(),
  actions: {
    vincular() {
      var ip = prompt("Ingrese la dirección IP del equipo: ", "192.168.10.1");

      if (ip) {
        var api = this.get('api');
        var url = "http://{host}:{port}{route-equipos}"
              .replace('{host}',api.host)
              .replace('{port}',api.port)
              .replace('{route-equipos}',api.routes.equipos);

        $.ajax({
          url: url,
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
