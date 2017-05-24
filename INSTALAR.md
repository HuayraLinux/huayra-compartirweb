# Instalación

Estos son los pasos de instalación para ejecutar
la aplicación en modo desarrollo.

## Huayra GNU/Linux

Huayra-Compartir ya viene instalado en el sistema operativo
huayra. No hace falta ejecutar ningún paso adicional de instalación.

Si quieres ejecutar la versión de desarrollo de este repositorio solamente
tienes que ejecutar el comando:

    nw src

## Ubuntu y/o Debian GNU/Linux

Primero tienes que instalar node-js y npm con los comandos:

    sudo apt-get update
    sudo apt-get install node nodejs-legacy npm libudev1
    npm config set strict-ssl false

Por último hay que instalar node-webkit y reparar udev, pero teniendo
en cuenta si tu equipo es de 32 o 64 bits:

Si tienes un equipo de 32 bits:

    sudo ln -s /usr/i386-linux-gnu/libudev.so.1 /usr/lib/libudev.so.0
    wget https://s3.amazonaws.com/node-webkit/v0.7.5/node-webkit-v0.7.5-linux-ia32.tar.gz
    tar xzf node-webkit-v0.7.5-linux-ia32.tar.gz
    mv node-webkit-v0.7.5-linux-ia32 node-webkit

Si tienes un equipo de 64 bits:

    sudo ln -s /usr/x86_64-linux-gnu/libudev.so.1 /usr/lib/libudev.so.0
    TODO: URL de la version 0.7.5 para amd64

Luego, los siguientes pasos son identicos en 32 o 64 bits:

    sudo mv node-webkit /usr/local/share/
    sudo ln -s /usr/local/share/node-webkit/nw /usr/local/bin/nw


Ok, ahora para ejecutar la aplicación tienes que ejecutar:

    make init
    make test_linux


Ten en cuenta que estos pasos son los mas simples y estables que
encontré para las últimas versiones de ubuntu y debian, tal vez en
tu caso resulten mas convenientes otros pasos, por ejemplo instalar
node desde el código fuente o algo así: 

 - https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#wiki-debian-lmde
