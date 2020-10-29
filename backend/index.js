const PROD = process.env.NODE_ENV === 'production';

if (!PROD) require('dotenv').config();
const dbconfig = PROD ? require('opswork') : require('./db');
const package = require('./package.json');
const express = require('express');
const mysql = require('mysql');
const uuid = require('uuid');
const morgan = require('morgan');
const AWS = require('aws-sdk');
//AWS.setSDKInstance(require('aws-sdk'));

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

const pool = mysql.createPool({
  connectionLimit : 10,
  host: dbconfig.db['host'],
  user: dbconfig.db['username'],
  password: dbconfig.db['password'],
  port: dbconfig.db['port'],
  database: dbconfig.db['database']
});

const getBase64Buffer = base64 => {
  const imageFileTypes = ['jpeg', 'jpg', 'png'];
  const buffer = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const type = base64.split(';')[0].split('/')[1];
  if (!imageFileTypes.includes(type)) throw Error(`Can only accept 'jpeg' and 'png', not '${type}'`);
  return { buffer, type };
};

const dbInsertQuery = (uuid, desc, type, size) => {
  return new Promise((res, rej) => {
    pool.query('INSERT INTO ? ?', [uuid, desc], (err, data) => {
      if (err) throw rej(err);
      res(data);
    });
  })
}

const uploadBase64ToS3 = async (base64) => {
  const { buffer, type } = getBase64Buffer(base64);
  const id = uuid.v4();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`
  };
  const result = await s3.upload(params).promise();
  console.log(`File uploaded successfully. ${result.Location}`);
  return { id, result };
};

app.get('/', (_, res) => {
  res.send(`Crossover file upload running, version: ${package.version}`);
});

app.post('/upload', async (req, res) => {
  const body = req.body;
  if (!body.file) {
    return res.status(400).json({
      ok: false,
      message: 'Field "file" not found in body',
      code: 400
    });
  }
  try {
    const { id, result } = await uploadBase64ToS3(body.file);
    await dbInsertQuery(id, body.description);
    res.status(201).send({
      ok: true,
      data: { id, url: result.Location }
    });
  } catch(err) {
    console.log(err.stack);
    res.status(500).send({
      ok: false,
      message: err.message,
      code: 500
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`check out the magic at: http://localhost:${process.env.PORT}`);
});
