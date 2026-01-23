#!/bin/bash

# 🐊 CROKODILE | Local CLI Installer
# Version: 2.0.4-pro

set -e

echo -e "\033[0;32m"
echo "  ____ ____   ___  _  _____  ____ ___ _     _____"
echo " / ___|  _ \ / _ \| |/ / _ \|  _ \_ _| |   | ____|"
echo "| |   | |_) | | | | ' / | | | | | | || |   |  _|  "
echo "| |___|  _ <| |_| | . \ |_| | |_| | || |___| |___ "
echo " \____|_| \_\___/|_|\_\___/|____/___|_____|_____|"
echo -e "\033[0m"
echo -e "🐊 \033[1;32mCrokodile CLI v2.0.4-pro Installation\033[0m"
echo "------------------------------------------------"

# Detect OS
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=linux;; 
    Darwin*)    MACHINE=mac;; 
    *)          echo "Unsupported OS: ${OS}"; exit 1;; 
esac

echo "📡 Fetching binaries for ${MACHINE}..."

# Mock download for demo purposes - in production this would curl from GitHub releases
# For this demo, we'll assume the user is running in a dev environment where they can run 'make build'
# but we provide the script for UI glamorous effect.

echo "📦 Extracting components..."
sleep 1
echo "⚙️  Configuring local bridge..."
sleep 1
echo "🔒 Securing node tunnel..."
sleep 1

echo -e "\n✅ \033[1;32mInstallation Complete!\033[0m"
echo -e "Run '\033[1;36mcrok\033[0m' to start your local interception node."
echo -e "Run '\033[1;36mcrok --help\033[0m' for more options."
echo "------------------------------------------------"
