require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const morgan = require('morgan');
const AWS = require('aws-sdk');

const pkg = require('./package.json');
const utils = require('./utils');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();
const app = express();
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.RDS_NAME,
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));

app.get('/', (_, res) => {
  res.send(`Crossover file upload running, version: ${pkg.version}`);
});

app.post('/upload', async (req, res) => {
  const { file, description } = req.body;
  if (!file) {
    return res.status(400).json({
      ok: false,
      message: 'Object "file" not found in body',
      code: 400,
    });
  }
  try {
    const { id, url, size, type } = await utils.uploadBase64ToS3(s3, file);
    await utils.dbInsertQuery(pool, 'Images', id, description, size, type);
    res.status(201).send({
      ok: true,
      data: { id, url, description },
    });
  } catch (err) {
    console.warn(err.stack);
    res.status(500).send({
      ok: false,
      message: err.message,
      code: 500,
    });
  }
});

app.server = app.listen(process.env.PORT, () => {
  console.log(`server running at: http://localhost:${process.env.PORT}`);
});

module.exports = app;
