#!/bin/sh
set -e
set -u

yarn pre-commit

BUMP_TYPE="${1:-"patch"}"
yarn run bump -- ${BUMP_TYPE}
git commit -am "bump version to $(node -p -e "require('./package.json').version")"
git tag -a "v$(node -p -e "require('./package.json').version")" -m "v$(node -p -e "require('./package.json').version")"
git push && git push --tags
