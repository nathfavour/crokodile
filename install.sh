#!/bin/bash

# 🐊 CROKODILE Universal Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/nathfavour/crokodile/main/install.sh | bash

set -e

REPO="nathfavour/crokodile"
GITHUB_URL="https://github.com/$REPO"
BINARY_ALIAS="crok"

# Detect OS
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
    x86_64) ARCH="amd64" ;; 
    aarch64|arm64) ARCH="arm64" ;; 
    armv7*) ARCH="arm" ;; 
    i386|i686) ARCH="386" ;; 
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;; 
esac

if [ "$OS" = "darwin" ]; then
    OS="darwin"
elif [ "$OS" = "linux" ]; then
    if [ -n "$TERMUX_VERSION" ] || [ -d "/data/data/com.termux" ]; then
        OS="android"
    else
        OS="linux"
    fi
else
    echo "Unsupported OS: $OS"
    exit 1
fi

echo "Detected Platform: $OS/$ARCH"

# We always aim for the 'latest' rolling tag unless specified
LATEST_TAG="latest"

echo "Resolved version: $LATEST_TAG"

# Binary name format from workflow: crok_${GOOS}_${GOARCH}
BINARY_NAME="crok_${OS}_${ARCH}"
[ "$OS" = "windows" ] && BINARY_NAME+=".exe"

DOWNLOAD_URL="$GITHUB_URL/releases/download/$LATEST_TAG/$BINARY_NAME"

echo "Downloading $BINARY_NAME..."
TMP_DIR=$(mktemp -d)
if ! curl -L "$DOWNLOAD_URL" -o "$TMP_DIR/$BINARY_NAME"; then
    echo "Error: Failed to download binary from $DOWNLOAD_URL"
    echo "The release might still be building or this platform isn't supported yet."
    exit 1
fi

chmod +x "$TMP_DIR/$BINARY_NAME"

# Install binary
INSTALL_DIR="/usr/local/bin"
if [ "$OS" = "android" ]; then
    INSTALL_DIR="$HOME/bin"
elif [ -d "$HOME/.local/bin" ]; then
    INSTALL_DIR="$HOME/.local/bin"
fi

if [ ! -d "$INSTALL_DIR" ]; then
    mkdir -p "$INSTALL_DIR" 2>/dev/null || true
fi

echo "Installing to $INSTALL_DIR/$BINARY_ALIAS..."
if [ -w "$INSTALL_DIR" ]; then
    mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_ALIAS"
else
    sudo mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_ALIAS"
fi

rm -rf "$TMP_DIR"

echo "✅ Successfully installed Crokodile to $INSTALL_DIR/$BINARY_ALIAS"

# Path check
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    echo "⚠️  $INSTALL_DIR is not in your PATH."
    echo "Add 'export PATH=\"
$PATH:$INSTALL_DIR\"' to your shell config."
fi