#!/bin/bash

N="\x1b[0m"
V="\x1b[32;01m"
R="\033[1;31m"

NEEDED_COMMANDS="node npm bower nw"

for cmd in ${NEEDED_COMMANDS} ; do
    if ! command -v ${cmd} &> /dev/null ; then
        echo "${R}ERROR: imposible ejecutar el comando${N}"
        echo "${R}Hay dependencias sin instalar, como '${cmd}' por ejemplo ...${N}"
        echo ""
        echo "  Asegurate de instalar todo lo necesario para ejecutar esta aplicación, "
        echo "  vas a encontrar instrucciones detalladas para resolver este problema en:"
        echo ""
        echo "    - el archivo INSTALAR.md"
        echo "    - en https://github.com/HuayraLinux/huayra-compartirweb/blob/master/INSTALAR.md"
        echo ""
        echo ""
        exit 1
    fi
done

touch .dependencias
