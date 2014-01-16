N=\x1b[0m
V=\x1b[32;01m
VERSION=`git name-rev --name-only --tags HEAD | sed 's/\^.*//'`

all:
	@echo ""
	@echo " $(V)test_mac$(N)     Prueba la aplicacion usando nodewebkit en mac osx."
	@echo " $(V)build$(N)        Genera las versiones compiladas."
	@echo " $(V)version$(N)      Informa el numero de version."
	@echo ""

version:
	@echo $(VERSION)

build:
	clear
	@echo "Borrando archivos de releases anteriores."
	rm -f -r webkitbuilds/releases/
	grunt nodewebkit

test_mac:
	@echo "Cuidado - se está usando la version de nodewebkit del sistema."
	open -a /Applications/node-webkit.app src
