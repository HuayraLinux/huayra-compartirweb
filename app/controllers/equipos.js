import Ember from 'ember';

export default Ember.Controller.extend({
  api: Ember.inject.service(),
  actions: {
    vincular() {
      var self = this;
      var ip = prompt("Ingrese la dirección IP del equipo: ", "192.168.10.1");

      if (ip) {
        var api = this.get('api');
        var base_url = "http://{host}:{port}",
            api_url = base_url+"{route-equipos}";

        base_url = base_url
          .replace('{host}',ip)
          .replace('{port}',api.port);
        api_url = api_url
          .replace('{host}',api.host)
          .replace('{port}',api.port)
          .replace('{route-equipos}',api.routes.equipos);

        $.ajax( base_url )
          .done(function() {
            $.ajax({
              url: api_url,
              type: 'post',
              dataType: 'json',
              data: {host: ip, id: Math.trunc(Math.random() * 1000000000)}
              })
              .done(function(){
                self.send('actualizar');
              });
          })
          .fail(function(){
            console.log("agregando ",ip,": fail");
          });
      }
    }
  }
});
