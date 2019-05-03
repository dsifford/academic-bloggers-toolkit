#!/usr/bin/env bash

wp site empty --yes
wp plugin activate academic-bloggers-toolkit
wp plugin deactivate classic-editor
