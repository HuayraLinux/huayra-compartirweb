import Ember from 'ember';

var gui = window.requireNode('nw.gui');
var ventana = gui.Window.get();

export default Ember.Service.extend({
  // menu principal
  menu: new gui.Menu(),
  // traybar
  tray: null,
  // items de menu
  itemMostrar: null,
  itemSalir: null,
  // status
  hidden: false,
  init(){
    var self = this;
    var prefix = 'img/';
    var appController = this.controllerFor("application");

    var mostrar_ventana = function(){
      ventana.show();
      ventana.restore();
    };

    var esconder_ventana = function(){
      ventana.hide();
    };

    var toggle_ventana = function(){
      var hidden = self.get('hidden');

      if( hidden ){ mostrar_ventana(); hidden = false; }
      else{ esconder_ventana(); hidden = true;}

      self.set('hidden', hidden);
    };

    var tray = new gui.Tray({
      title: '',
      icon: prefix + 'hcompartir-idle.png',
      click: function(){ toggle_ventana(); }
    });
    this.set('tray', tray);

    var mostrar = new gui.MenuItem({
      label: 'Mostrar',
      click: function(){ mostrar_ventana(); }
    });
    this.set('itemMostrar', mostrar);

    var salir = new gui.MenuItem({
      label: 'Salir',
      click: function() {
        appController.captureClose();
        gui.App.closeAllWindows();
      },
      enabled: true
    });
    this.set('itemSalir', salir);

    var menu = this.get('menu');
    menu.append(mostrar);
    menu.append(salir);

    tray.menu = menu;
  }
});
