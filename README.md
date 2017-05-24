Huayra-Compartir
================

Huayra-Compartir es una herramienta diseñada para compartir distintos tipos
de archivos dentro de una red local.


![Imagen de huayra-compartir en funcionamiento](imagenes/preview_3.png)
![Imagen de huyara-compartir en funcionamiento](imagenes/preview_4.png)


Este software forma parte del proyecto Huayra Gnu/Linux, es software libre y
se distribuye instalado en las netbooks del Programa Conectar Igualdad en Argentina.


Instalación
-----------

Si querés probar esta aplicación directamente desde este repositorio, tenés
que seguir estos pasos:

1. Clonar el repositorio.
2. Pasarse a esta branch (estable).
3. Instalalar nodejs (y npm, generalmente vienen juntos).
4. ejecutar `make` en el directorio del proyecto para instalar todas las dependencias.
5. ejecutar `make test_mac` o `make test_linux` dependiendo de tu sistema operativo.

#### ¿Más simple?

```sh
git clone https://github.com/HuayraLinux/huayra-compartirweb && cd huayra-compartirweb && git checkout estable && make && make test_linux
```


¿Cómo funciona?
---------------

- [Presentando huayra-compartir (en http://examplelab.com.ar)](http://examplelab.com.ar/presentanto-huayra-compartir)
