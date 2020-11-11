# Crossover Full Stack Entry Test

[![CI](https://github.com/npinochet/crossover-test/workflows/CI/badge.svg)](https://github.com/npinochet/crossover-test/actions)

A simple web app to upload images using Node in the back-end and Angular in the front-end, all deployed using Amazon Web Services. As detailed [here](https://docs.google.com/document/d/1Sdc_vAShKVCY-lSkFg9-6-YUYvv3pma419sucMo7vd0/edit#bookmark=id.a7axd1qcy23).

Deployed URL: http://crossover-test-dist.s3-website.us-east-2.amazonaws.com

Repository: https://github.com/npinochet/crossover-test

[C4_Model](./docs/C4_model.png)

## Stack
### Back-end

* I used Node and Express to make the back-end since I've been using JavaScript a lot lately and wanted to stick to what I know.

* I used Mocha, Chai and Sinon to write the tests, since that seems to be most common approach I could find on the internet.

### Front-end

* The front-end isn't that complicated, it's just one simple component and a service, I made it that way since it seems enough to do the job. I will most certainly make more components in the second question.

* I choose to make my own style even though it's out of scope to give the page less boring.

### Considerations

* I implemented CI using GitHub's actions, as can be seen in the `.github/workflows` folder, it checks tests, linter and builds.

* The file transfer from front-end to back-end is done using base64 encoding since it's one way to keep the whole API consistent with JSON/HTTPS.

## Getting started

First and foremost, make sure you have `node` and `npm` installed on your machine, then install the dependencies:
```bash
$ cd backend
$ npm install
$ cd ../frontend
$ npm install
```

To run the back-end and front-end you can open two terminals and run:
```bash
$ npm start
````
On each of the `frontend` and `backend` folders. Or use bash's job control system and run:
```bash
$ npm start --prefix backend & npm start --prefix frontend &
```
There's also a `deploy.sh` script to run on a AWS EC2 instance to build and upload the front-end to an AWS S3 bucket and it also start's the back-end on the instance.

### Running locally

If there is a need to run the app locally and you have the AWS Elastic Search instance and/or the AWS RDS instance on the internal AWS VPC, you can access them through an ssh tunnel on the EC2 instance like so:
```bash
ssh -i ec2-key.pem ec2_user@ec2-18-222-149-250.us-east-2.compute.amazonaws.com -L 8001:vpc-crossover-bmb3metkdfnofvrbu7vxkmkpaa.us-east-2.es.amazonaws.com:80 -L 3306:database-crossover.cyou7lbdmw0u.us-east-2.rds.amazonaws.com:3306
```

And adjust the `.env` file to use `ES_SEARCH_ENDPOINT=http://localhost:8001/images/_search` and `RDS_HOST=localhost` accordingly.

**Author:** Nicolás Pinochet
