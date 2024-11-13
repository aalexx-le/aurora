#!/bin/bash

yarn config set version-git-tag false

cd frontend
yarn version $1
cd ..

# Release backend
cd backend
yarn version $1
cd ..

git add ./frontend/package.json ./backend/package.json
yarn version $1
