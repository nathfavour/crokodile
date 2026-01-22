#!/bin/bash

# 🐊 CROKODILE Universal Installer
# Usage: curl -fsSL https://raw.githubusercontent.com/nathfavour/crokodile/main/install.sh | bash

set -e

REPO="nathfavour/crokodile"
GITHUB_URL="https://github.com/$REPO"
BINARY_NAME="crok"

# Detect OS
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

case "$ARCH" in
    x86_64) ARCH="amd64" ;; 
    aarch64|arm64) ARCH="arm64" ;; 
    armv7*) ARCH="armv7" ;; 
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

# Get latest release tag
echo "Fetching release metadata..."

LATEST_TAG=""
if command -v git >/dev/null 2>&1; then
    LATEST_TAG=$(git ls-remote --tags "https://github.com/$REPO.git" | cut -d/ -f3 | grep -E "^v[0-9]" | sort -V | tail -n 1)
fi

if [ -z "$LATEST_TAG" ]; then
    TAG_DATA=$(curl -fsSL "https://api.github.com/repos/$REPO/releases/latest" || true)
    LATEST_TAG=$(echo "$TAG_DATA" | grep -oE '"tag_name": *"[^"]+"' | head -n 1 | cut -d'"' -f4)
fi

if [ -z "$LATEST_TAG" ]; then
    echo "Error: Failed to fetch latest release from GitHub."
    exit 1
fi

echo "Resolved version: $LATEST_TAG"

# Construct download URL (matching GoReleaser archive template)
# crokodile_Linux_x86_64.tar.gz
OS_NAME="$(uname -s)"
ARCH_NAME="$(uname -m)"

# Map to GoReleaser names
case "$OS" in
    linux) G_OS="Linux" ;; 
    darwin) G_OS="Darwin" ;; 
    android) G_OS="Android" ;; 
esac

case "$ARCH" in
    amd64) G_ARCH="x86_64" ;; 
    arm64) G_ARCH="arm64" ;; 
    armv7) G_ARCH="armv7" ;; 
    386) G_ARCH="i386" ;; 
esac

# Note: My .goreleaser.yaml uses: {{ .ProjectName }}_{{ .Os }}_{{ .Arch }}
# .Os is usually Title Case in GoReleaser if not specified otherwise, 
# but let's check what GoReleaser actually produces.
# Default is lowercase for .Os and .Arch in many configs.
# In my .goreleaser.yaml: 
# archives:
#   - name_template: "{{ .ProjectName }}_{{ .Os }}_{{ .Arch }}{{ if .Arm }}v{{ .Arm }}{{ end }}"

# Actually GoReleaser uses lowercase for {{ .Os }} and {{ .Arch }} by default.
# So: crokodile_linux_amd64.tar.gz

EXTENSION="tar.gz"
[ "$OS" = "windows" ] && EXTENSION="zip"

FILE_NAME="crokodile_${OS}_${ARCH}.${EXTENSION}"
DOWNLOAD_URL="$GITHUB_URL/releases/download/$LATEST_TAG/$FILE_NAME"

echo "Downloading $FILE_NAME..."
TMP_DIR=$(mktemp -d)
curl -L "$DOWNLOAD_URL" -o "$TMP_DIR/$FILE_NAME"

echo "Extracting..."
if [ "$EXTENSION" = "tar.gz" ]; then
    tar -xzf "$TMP_DIR/$FILE_NAME" -C "$TMP_DIR"
else
    unzip -q "$TMP_DIR/$FILE_NAME" -d "$TMP_DIR"
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

echo "Installing to $INSTALL_DIR..."
if [ -w "$INSTALL_DIR" ]; then
    mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
else
    sudo mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
fi

rm -rf "$TMP_DIR"

echo "✅ Successfully installed Crokodile to $INSTALL_DIR/$BINARY_NAME"

# Path check
if [[ ":$PATH:" != ":$INSTALL_DIR:"* ]]; then
    echo "⚠️  $INSTALL_DIR is not in your PATH."
    echo "Add 'export PATH="\$PATH:$INSTALL_DIR"' to your shell config."
fi
