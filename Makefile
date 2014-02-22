N=\x1b[0m
V=\x1b[32;01m
VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`

all:
	@echo ""
	@echo " $(V)init$(N)         Instala todas las bibliotecas necesarias para comenzar."
	@echo " $(V)test_mac$(N)     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo " $(V)test_linux$(N)   Prueba la aplicacion usando nodewebkit en linux."
	@echo " $(V)build$(N)        Genera las versiones compiladas."
	@echo " $(V)version$(N)      Informa el numero de version."
	@echo ""

.dependencias:
	@sh verificar_dependencias.sh


version:
	@echo $(VERSION)

build: .dependencias
	clear
	@echo "$(V)Borrando archivos de releases anteriores.$(N)"
	rm -f -r webkitbuilds/releases/
	@echo "$(V)Creando binarios para Windows, MAC y GNU/Linux.$(N)"
	@echo "$(V)-- Esto demora varios minutos --$(N)"
	grunt nodewebkit

init: .dependencias
	@echo "$(V)Instalando dependencias de nodejs en ./node_modules/ ... $(N)"
	npm install
	@echo "$(V)Instalando dependencias frontend con bower en ./src/bower_components/ ... $(N)"
	cd ./src/; bower install

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app src

test_linux: .dependencias
	nw src


test:
	echo "..."

install:
	echo "..."
