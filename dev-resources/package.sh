#!/bin/bash

cd ..

rm -f firefox.zip
mkdir -p temp

cp popup.html temp
cp permissions.html temp
cp manifest-firefox.json temp/manifest.json
cp LICENSE temp
cp -r scripts temp
cp -r ext-resources temp

cd temp
zip -r ../firefox.zip *
cd ..
rm -r temp



rm -f chrome.zip
mkdir -p temp

cp popup.html temp
cp permissions.html temp
cp manifest-chrome.json temp/manifest.json
cp LICENSE temp
cp -r scripts temp
cp -r ext-resources temp

cd temp
zip -r ../chrome.zip *
cd ..
rm -r temp
