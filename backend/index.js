const ENV = 'local'; // local, dev, prod
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'test';

const package = require('./package.json');
const express = require('express');
const mysql = require('mysql');
const uuid = require('uuid');
// const multer = require('multer');
const morgan = require('morgan');
const dbconfig = require('./db');
const AWS = require('aws-sdk');
//AWS.setSDKInstance(require('aws-sdk'));

const accessKeyId =  process.env.AWS_ACCESS_KEY || 'xxxxxx';
const secretAccessKey = process.env.AWS_SECRET_KEY || '+xxxxxx+B+xxxxxxx';

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

const s3 = new AWS.S3();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
// app.use(multer({ limits: { fileSize: 100000 } }));

const pool = mysql.createPool({
  connectionLimit : 10,
  host: dbconfig.db['host'],
  user: dbconfig.db['username'],
  password: dbconfig.db['password'],
  port: dbconfig.db['port'],
  database: dbconfig.db['database']
});

const dbInsertQuery = (id, desc) => {
  return new Promise((res, rej) => {
    pool.query('INSERT INTO', [id, desc], (err, data) => {
      if (err) throw rej(err);
      res(data);
    });
  })
}

const uploadFileToS3 = async (data, desc) => {
  const id = uuid.v4();
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: id,
    Body: data
  };
  const result = await s3.upload(params).promise();
  console.log(`File uploaded successfully. ${result.Location}`);
  await dbInsertQuery(id, desc);
  return id;
};

app.get('/', (_, res) => {
  res.send(`Crossover file upload running, version: ${package.version}`);
});

app.post('/api', (req, res) => {
  let randomId = Math.floor(Math.random()*1000);
  const newData = Object.assign({id: randomId}, req.body);
  myData.push(newData);
  res.json(myData)
});

app.post('/upload', async (req, res, next) => {
  if (!req.files) {
    next();
    return;
  }
  const id = await uploadFileToS3(req.files.name);
  res.status(201).send(id);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`check out the magic at: http://localhost:${port}`);
});
