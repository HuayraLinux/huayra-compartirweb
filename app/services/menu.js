import Ember from 'ember';

var gui = window.requireNode('nw.gui');


export default Ember.Service.extend({
  // menu principal
  menubar: new gui.Menu({ type: 'menubar' }),
  // items de menu
  menuArchivo: new gui.Menu(),
  menuOpciones: new gui.Menu(),
  menuVer: new gui.Menu(),
  menuAyuda: new gui.Menu(),
  // items de menu
  itemMisArchivos: null,
  itemServicios: null,
  itemDescargas: null,
  itemEquipos: null,
  itemPreferencias: null,
  itemSalir: null,
  itemAcercaDe: null,
  itemSeparador: null,
  init(){
    var misArchivos = new gui.MenuItem({
      label: 'Mis Archivos',
      click: function() {},
      enabled: false
    });
    this.set('itemMisArchivos', misArchivos);

    var servicios = new gui.MenuItem({
      label: 'Servicios',
      click: function() {},
      enabled: false
    });
    this.set('itemServicios', servicios);

    var descargas = new gui.MenuItem({
      label: 'Descargas',
      click: function() {},
      enabled: false
    });
    this.set('itemDescargas', descargas);

    var equipos = new gui.MenuItem({
      label: 'Equipos',
      click: function() {},
      enabled: false
    });
    this.set('itemEquipos', equipos);

    var preferencias = new gui.MenuItem({
      label: 'Preferencias',
      click: function() {},
      enabled: false
    });
    this.set('itemPreferencias', preferencias);

    var acercaDe = new gui.MenuItem({
      label: 'Acerca de...',
      click: function() {},
      enabled: false
    });
    this.set('itemAcercaDe', acercaDe);

    var salir = new gui.MenuItem({
      label: 'Salir',
      click: function() {
        gui.App.closeAllWindows();
      },
      enabled: true
    });
    this.set('itemSalir', salir);

    var separador = new gui.MenuItem({type: 'separator'});
    this.set('itemSeparador', separador);

    var menu_archivo = this.get('menuArchivo');
    menu_archivo.append(servicios);
    menu_archivo.append(separador);
    menu_archivo.append(salir);


    var menu_ayuda = this.get('menuAyuda');
    menu_ayuda.append(acercaDe);

    var menubar = this.get('menubar');
    menubar.append(new gui.MenuItem({ label: 'Archivo', submenu: menu_archivo}));
    menubar.append(new gui.MenuItem({ label: 'Ayuda', submenu: menu_ayuda}));

    gui.Window.get().menu = menubar;
  },

});
