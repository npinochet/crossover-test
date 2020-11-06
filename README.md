# Crossover Full Stack Entry Test

[![CI](https://github.com/npinochet/crossover-test/workflows/CI/badge.svg)](https://github.com/npinochet/crossover-test/actions)

A simple web app to upload images using Node in the back-end and Angular in the front-end, all deployed using Amazon Web Services. As detailed [here](https://docs.google.com/document/d/1Sdc_vAShKVCY-lSkFg9-6-YUYvv3pma419sucMo7vd0/edit#bookmark=id.a7axd1qcy23)

Deployed URL: https://du6eamaktejxq.cloudfront.net
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
on each of the `frontend` and `backend` folders. Or use bash's job control system and run:
```bash
$ npm start --prefix backend & npm start --prefix frontend &
```
There's also a `deploy.sh` script to run on a AWS EC2 instance to build the front-end and upload it to an AWS S3 bucket and it also start's the back-end on the instance.

**Author:** Nicolás Pinochet
