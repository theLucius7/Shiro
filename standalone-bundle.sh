#!env bash
set -e
CWD=$(pwd)

cd .next
pwd
rm -rf cache
# cp ../next.config.mjs ./standalone/next.config.mjs
cp -r ../public ./standalone/public

cd ./standalone
echo ';process.title = "Shiro (NextJS)"' >>server.js
if [ -d ../static ]; then
  rm -rf ./.next/static
  cp -r ../static ./.next/static
elif [ ! -d ./.next/static ]; then
  echo "missing .next/static build output" >&2
  exit 1
fi

cp $CWD/ecosystem.standalone.config.cjs ./ecosystem.config.js

cd ..

# Some reverse proxies serve /_next/static directly from the unpacked release
# directory instead of proxying it to the standalone server. Mirror the static
# assets to a top-level _next/static directory so both setups work.
rm -rf ./_next
mkdir -p ./_next
cp -r ./standalone/.next/static ./_next/static

mkdir -p $CWD/assets
rm -rf $CWD/assets/release.zip
zip --symlinks -r $CWD/assets/release.zip ./*
