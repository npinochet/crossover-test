require('dotenv').config();
const package = require('./package.json');
const express = require('express');
const cors = require('cors')
const mysql = require('mysql');
const uuid = require('uuid');
const morgan = require('morgan');
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

const s3 = new AWS.S3();
const app = express();
const pool = mysql.createPool({
  connectionLimit : 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_NAME
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }))
app.use(morgan('combined'));

const getBase64Buffer = base64 => {
  const imageFileTypes = ['jpeg', 'jpg', 'png'];
  const buffer = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const type = base64.split(';')[0].split('/')[1];
  if (!imageFileTypes.includes(type)) throw Error(`Can only accept 'jpeg' and 'png', not '${type}'`);
  return { buffer, type };
};

const dbInsertQuery = (uuid, desc, size, type) => {
  return new Promise((res, rej) => {
    const query = `INSERT INTO Images VALUES (?, ?, ?, ?);`;
    const values = [uuid, desc, size, type];
    pool.query(query, values, (err, data) => {
      if (err) throw rej(err);
      res(data);
    });
  })
}

const uploadBase64ToS3 = async base64 => {
  const { buffer, type } = getBase64Buffer(base64);
  const id = uuid.v4();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: id,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`
  };
  const { Location } = await s3.upload(params).promise();
  console.log(`File uploaded successfully. ${Location}`);
  return {  
    id,
    url: Location,
    size: Buffer.byteLength(buffer),
    type
  };
};

app.get('/', (_, res) => {
  res.send(`Crossover file upload running, version: ${package.version}`);
});

app.post('/upload', async (req, res) => {
  const { file, description } = req.body;
  if (!file) {
    return res.status(400).json({
      ok: false,
      message: 'Object "file" not found in body',
      code: 400
    });
  }
  try {
    const { id, url, size, type } = await uploadBase64ToS3(file);
    await dbInsertQuery(id, description, size, type);
    res.status(201).send({
      ok: true,
      data: { id, url, description }
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
