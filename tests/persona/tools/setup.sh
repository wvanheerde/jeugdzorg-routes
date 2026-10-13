#!/usr/bin/env bash
# Zet de browser voor persona-tests klaar. Herhaalbaar: slaat over wat er al is.
# Werkt zonder root (devcontainer): systeembibliotheken worden met apt-get download
# opgehaald en uitgepakt in ~/.cache/jr-browser-libs; browser.mjs zet LD_LIBRARY_PATH zelf.
# Op een Mac of een machine met de bibliotheken al aanwezig is alleen stap 1 en 2 nodig.
set -euo pipefail
cd "$(dirname "$0")"

# 1. Playwright (eigen package.json, los van de site)
[ -d node_modules/playwright ] || npm install --no-audit --no-fund

# 2. Chromium
npx playwright install chromium

# 3. Systeembibliotheken (alleen Linux, alleen als ze ontbreken)
[ "$(uname -s)" = "Linux" ] || exit 0
BIN=$(ls -d ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux-*/chrome-headless-shell | tail -1)
L=~/.cache/jr-browser-libs
export LD_LIBRARY_PATH="$L/root/usr/lib/aarch64-linux-gnu:$L/root/lib/aarch64-linux-gnu:$L/root/usr/lib/x86_64-linux-gnu:$L/root/lib/x86_64-linux-gnu"
if ! ldd "$BIN" | grep -q 'not found' && [ -f "$L/fonts.conf" ]; then echo "Browser klaar."; exit 0; fi

A=$(mktemp -d)
mkdir -p "$A/lists/partial" "$A/cache/archives/partial" "$L/debs"
APT="apt-get -o Dir::State::Lists=$A/lists -o Dir::Cache=$A/cache -o Debug::NoLocking=1 -o APT::Sandbox::User=$(id -un)"
$APT update >/dev/null 2>&1 || true
PKGS="libglib2.0-0t64 libnspr4 libnss3 libatk1.0-0t64 libdbus-1-3 libx11-6 libxcomposite1 libxdamage1 libxext6
libxfixes3 libxrandr2 libgbm1 libxcb1 libxkbcommon0 libasound2t64 libatspi2.0-0t64 libxau6 libxdmcp6 libxi6
libxrender1 libdrm2 libwayland-server0 libffi8 libpcre2-8-0 libmount1 libselinux1 libexpat1 libsystemd0 libblkid1
libbsd0 libmd0 libz3-4 libatomic1 libxres1 libfontconfig1 fontconfig-config libfreetype6 libpng16-16t64 libbrotli1
libcap2 liblz4-1 liblzma5 libzstd1 libgcrypt20 libgpg-error0 fonts-dejavu-core fonts-liberation fonts-noto-color-emoji"
( cd "$L/debs" && for p in $PKGS; do $APT download "$p" >/dev/null 2>&1 || echo "Niet gevonden: $p"; done )
for f in "$L"/debs/*.deb; do dpkg -x "$f" "$L/root"; done
cat > "$L/fonts.conf" <<EOF
<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>
<dir>$L/root/usr/share/fonts</dir><cachedir>$L/fontcache</cachedir>
<alias><family>sans-serif</family><prefer><family>Liberation Sans</family><family>DejaVu Sans</family></prefer></alias>
<alias><family>serif</family><prefer><family>Liberation Serif</family><family>DejaVu Serif</family></prefer></alias>
</fontconfig>
EOF
rm -rf "$A"
if ldd "$BIN" | grep 'not found'; then echo "Nog bibliotheken ontbreken (zie hierboven)."; exit 1; fi
echo "Browser klaar."
