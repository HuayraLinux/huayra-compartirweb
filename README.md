Huayra-Compartir
================

Huayra-Compartir es una herramienta diseñada para compartir distintos tipos
de archivos dentro de una red local.


![](imagenes/captura.png)

Este software forma parte del proyecto Huayra Gnu/Linux, es software libre y
se distribuye instalado en las netbooks del Programa Conectar Igualdad en Argentina.


Instalación
-----------

Si querés probar esta aplicación directamente desde este repositorio, tenés
que seguir estos pasos:

- clonar el repositorio.
- instalalar nodejs.
- instalar `bower` de forma global con el comando `sudo npm install -g bower`.
- ejecutar `make init` en el directorio del proyecto para instalar todas las dependencias.
- ejecutar `make test_mac` o `make test_linux` dependiendo de tu sistema operativo.


¿Cómo funciona?
---------------

Esta aplicación está realizada con node-webkit, una plataforma para
hacer aplicaciones que combina chromium y nodejs.

Cuando se abre la aplicación, se abre el archivo index.html
junto con el archivo 'assets/js/app.js', este archivo inicializa varias
cosas, por un lado angularjs, para gestionar la interfaz de usuario.

El archivo servidor.js contiene un servidor web realizado con express. El archivo
servidor.js solo contiene el objeto Servidor, quien lo inicializa es el archivo app.js.

El servidor web se inicializa en un puerto eleatorio, podés ver este número de puerto
en la barra de título de la aplicación o bien abriendo las devtools.

El servidor utiliza REST, y algunos conceptos de Hypermedia. Si abris la aplicación, y
luego vas con un navegador a ver el servicio vas a notar los campos url en cada respuesta.