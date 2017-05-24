V=[01;32m
N=[0m
VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`

all: init

help:
	@echo ""
	@echo " $(V)init$(N)         Instala todas las bibliotecas necesarias para comenzar."
	@echo " $(V)test_mac$(N)     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo " $(V)test_linux$(N)   Prueba la aplicacion usando nodewebkit en linux."
	@echo " $(V)version$(N)      Informa el numero de version."
	@echo ""

version:
	@echo $(VERSION)

init:
	@echo "$(V)Instalando dependencias de nodejs en ./node_modules/ ... $(N)"
	npm install
	@echo "$(V)Instalando dependencias frontend con bower en ./src/bower_components/ ... $(N)"
	cd src/ && ../node_modules/.bin/bower install

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app src

test_linux:
	nw src

clean:
	rm -rf node_modules src/bower_components
