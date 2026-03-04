#!/usr/bin/env bash
set -euo pipefail

node scripts/build-bundle.js
mkdir -p dist
TWEEGO_PATH=tweego/storyformats tweego/tweego -f sugarcube-2 -o dist/index.html src/story/ src/js/ src/css/
echo "Built: dist/index.html"
