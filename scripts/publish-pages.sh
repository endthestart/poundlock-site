#!/bin/sh
# Build the site and publish it to the gh-pages branch, until the Actions workflow
# takes over. Point POUNDLOCK_SRC and TOOLKIT_SRC at checkouts of each repo's main.
set -eu
cd "$(dirname "$0")/.."
: "${POUNDLOCK_SRC:?checkout of endthestart/poundlock}" "${DISPATCH_SRC:?checkout of endthestart/poundlock-dispatch}" "${TOOLKIT_SRC:?checkout of endthestart/poundlock-toolkit}"
npm run build
out=$(mktemp -d)
trap 'rm -rf "$out"' EXIT
cp -R dist/. "$out/"
touch "$out/.nojekyll"
site=$(git rev-parse --short HEAD)
pound=$(git -C "$POUNDLOCK_SRC" rev-parse --short HEAD)
disp=$(git -C "$DISPATCH_SRC" rev-parse --short HEAD)
tool=$(git -C "$TOOLKIT_SRC" rev-parse --short HEAD)
cd "$out"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -qm "Build of poundlock-site $site with poundlock $pound, dispatch $disp and toolkit $tool"
git push -q --force "$(git -C "$OLDPWD" remote get-url origin)" gh-pages
echo "published $site (poundlock $pound, dispatch $disp, toolkit $tool)"
