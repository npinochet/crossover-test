#/bin/bash
set -e

# Pull repo
git pull origin master

# Make sure you have an up to date env file in parent folder
cp ../env backend/.env

# Build and deploy frontend on S3
cd frontend
npm ci
npm run build:prod
aws s3 cp dist/crossover-test-frontend/ s3://crossover-test-dist/ --recursive --acl public-read

# Run backend with forever
cd ../backend
npm ci
npm install forever -g
forever stopall
NODE_ENV=production forever -a -o out.log -e err.log start index.js
