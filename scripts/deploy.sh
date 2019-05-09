#!/usr/bin/env bash

VERSION="${npm_package_version?This script must be called using npm}"
ROOTDIR=$PWD
SVNROOT=$(cd "$ROOTDIR" && cd ../SVN && pwd || exit)

# shellcheck source=../.env
. "$ROOTDIR"/.env

# Make sure svn repo is up to date
cd "$SVNROOT" || exit

svn update \
	--username "${SVN_USER:?SVN_USER not defined in env}" \
	--password "${SVN_PASS:?SVN_PASS not defined in env}"

# Delete entire trunk directory
rm -rf trunk/*

# Create tag directory
mkdir -p tags/"$VERSION"

# Copy dist over to tag and trunk directory
cp -r "$ROOTDIR"/dist/* "$SVNROOT"/trunk/
cp -r "$ROOTDIR"/dist/* "$SVNROOT"/tags/"$VERSION"/

# Remove deleted files
svn stat | awk '/^!/{print $2}' | xargs --no-run-if-empty svn rm

# Add new files
svn stat | awk '/^?/{print $2}' | xargs --no-run-if-empty svn add

# Commit the changes
svn commit \
	--username "$SVN_USER" \
	--password "$SVN_PASS" \
	-m "Release $VERSION"
