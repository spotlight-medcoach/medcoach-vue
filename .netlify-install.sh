#!/bin/bash
# Script de instalación para Netlify
# Configura Git para usar HTTPS en lugar de SSH

echo "Configurando Git para usar HTTPS..."
git config --global url."https://github.com/".insteadOf "ssh://git@github.com/"
git config --global url."https://".insteadOf "git+ssh://"

echo "Instalando dependencias con npm..."
npm install

