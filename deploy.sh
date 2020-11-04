#/bin/bash
set -e

# Clone repo
git clone https://github.com/npinochet/crossover-test.git
cp env crossover/backend/.env

# Build and deploy frontend on S3
cd crossover-test/frontend
npm ci
npm run build-prod
aws s3 cp dist/crossover-test-frontend/ s3://crossover-test-bucket/

# Run backend
cd ../backend
npm ci
npm install forever -g
NODE_ENV=production forever -l node.log -o out.log -e err.log start index.js
