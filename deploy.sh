#/bin/bash

# Clone repo
git clone URL_GITHUB

# Build and deploy frontend on S3
cd crossover-test/frontend
npm install
npm run build-prod
aws s3 cp dist/crossover-test-frontend/ s3://crossover-test-bucket/

# Run backend
cd ../backend
npm install
npm install forever -g
NODE_ENV=production forever -l node.log -o out.log -e err.log start index.js
