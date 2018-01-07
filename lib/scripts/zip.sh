#!/usr/bin/env bash

VERSION="${npm_package_version?This script must be called using npm}"
SCRIPTDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTDIR=$(cd "$SCRIPTDIR" && cd ../../ && pwd || exit)

rm -f "$ROOTDIR"/lib/tmp/bin/*
zip -r "$ROOTDIR/lib/tmp/bin/academic-bloggers-toolkit-$VERSION.zip" "$ROOTDIR/dist"
