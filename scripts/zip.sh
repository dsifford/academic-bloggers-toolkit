#!/usr/bin/env bash
set -e

abt=academic-bloggers-toolkit
zip_filename="$abt-${npm_package_version:?This script must be invoked using npm scripts}".zip
cache_dir="./node_modules/.cache/$abt"

mkdir -p "$cache_dir/$abt" "$cache_dir"/bin
rm -f "$cache_dir"/bin/*
cp -a ./dist/. "$cache_dir/$abt"

cd "$cache_dir"

zip -r bin/"$zip_filename" "$abt"
rm -r "$abt"
