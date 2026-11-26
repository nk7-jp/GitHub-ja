#!/bin/sh
# Chrome ウェブストアにアップロードする zip を作る
set -e
cd "$(dirname "$0")"
v=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifest.json)
mkdir -p dist
rm -f "dist/GitHub-ja-$v.zip"
zip -r -q "dist/GitHub-ja-$v.zip" manifest.json _locales src popup icons/icon16.png icons/icon32.png icons/icon48.png icons/icon128.png LICENSE
echo "dist/GitHub-ja-$v.zip"
